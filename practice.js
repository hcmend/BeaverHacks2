// Function to generate random numbers
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate random math problems
function generateProblem() {
    const operators = ['+', '-', '*', '/'];
    const numTerms = getRandomNumber(2, 4); // Number of terms in the problem
    let problem = '';

    for (let i = 0; i < numTerms; i++) {
        const number = getRandomNumber(1, 20); // Random number between 1 and 20
        problem += number;

        if (i < numTerms - 1) {
            const operator = operators[getRandomNumber(0, operators.length - 1)];
            problem += ` ${operator} `;
        }
    }

    // Add parentheses randomly
    if (Math.random() > 0.5) {
        const parts = problem.split(' ');
        const start = getRandomNumber(0, parts.length - 3);
        const end = start + 2;
        parts[start] = `(${parts[start]}`;
        parts[end] = `${parts[end]})`;
        problem = parts.join(' ');
    }

    return problem;
}

// Function to display problems
function displayProblems() {
    const problemsDiv = document.getElementById('problems');
    problemsDiv.innerHTML = ''; // Clear previous problems

    for (let i = 0; i < 5; i++) { // Generate 5 problems
        const problem = generateProblem();
        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem';
        problemDiv.innerHTML = `
            <p>${i + 1}. ${problem}</p>
            <button onclick="showSolution('${problem}', ${i})">Show Steps and Solution</button>
            <div class="solution" id="solution-${i}"></div>
        `;
        problemsDiv.appendChild(problemDiv);
    }
}

// Function to show steps and solution
function showSolution(problem, index) {
    const solutionDiv = document.getElementById(`solution-${index}`);
    try {
        const steps = get_steps(problem); // Use the get_steps function
        const result = compute_value(problem, true); // Use the compute_value function
        solutionDiv.innerHTML = `
            <p><strong>Steps:</strong></p>
            <p>${steps.replace(/\n/g, '<br>')}</p>
            <p><strong>Solution:</strong> ${result}</p>
        `;
    } catch (error) {
        solutionDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Event listener for the "Generate New Problems" button
document.getElementById('generate').addEventListener('click', displayProblems);

// Generate problems on page load
document.addEventListener('DOMContentLoaded', displayProblems);

// ---------------- Calculator Logic ----------------

// Helper functions
function is_operator(str) {
    return ['+', '-', '*', '/', '^'].includes(str);
}

function is_number(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

// Function to compute the value of an expression
function compute_value(expression, show_work) {
    expression = expression.replace(/\s/g, ''); // Remove spaces
    if (!is_valid_expression(expression)) {
        throw new Error("Invalid expression");
    }

    expression = while_parentheses(expression, show_work);
    expression = while_exponents(expression, show_work);
    expression = while_multiply_or_divide(expression, show_work);
    expression = while_add_or_subtract(expression, show_work);

    return parseFloat(expression);
}

// Function to get steps for solving an expression
function get_steps(expression) {
    let steps = [];
    const originalExpression = expression;

    expression = while_parentheses(expression, true, steps);
    expression = while_exponents(expression, true, steps);
    expression = while_multiply_or_divide(expression, true, steps);
    expression = while_add_or_subtract(expression, true, steps);

    steps.push(`Final result: ${expression}`);
    return steps.join('\n');
}

// Function to handle parentheses
function while_parentheses(expression, show_work, steps = []) {
    let open_parenthesis = expression.lastIndexOf('(');
    while (open_parenthesis !== -1) {
        let close_parenthesis = expression.indexOf(')', open_parenthesis);
        let sub_expression = expression.slice(open_parenthesis + 1, close_parenthesis);

        sub_expression = while_exponents(sub_expression, show_work, steps);
        sub_expression = while_multiply_or_divide(sub_expression, show_work, steps);
        sub_expression = while_add_or_subtract(sub_expression, show_work, steps);

        expression = expression.slice(0, open_parenthesis) + sub_expression + expression.slice(close_parenthesis + 1);
        open_parenthesis = expression.lastIndexOf('(');

        if (show_work) steps.push(`After parentheses: ${expression}`);
    }
    return expression;
}

// Function to handle exponents
function while_exponents(expression, show_work, steps = []) {
    let index = expression.indexOf('^');
    while (index !== -1) {
        let base = '';
        let exponent = '';
        let i = index - 1;

        while (i >= 0 && !is_operator(expression[i])) {
            base = expression[i] + base;
            i--;
        }

        i = index + 1;
        while (i < expression.length && !is_operator(expression[i])) {
            exponent += expression[i];
            i++;
        }

        const result = Math.pow(parseFloat(base), parseFloat(exponent));
        expression = expression.slice(0, index - base.length) + result + expression.slice(index + exponent.length + 1);

        if (show_work) steps.push(`After exponents: ${expression}`);
        index = expression.indexOf('^');
    }
    return expression;
}

// Function to handle multiplication and division
function while_multiply_or_divide(expression, show_work, steps = []) {
    let index = expression.search(/[*\/]/);
    while (index !== -1) {
        let left = '';
        let right = '';
        let i = index - 1;

        while (i >= 0 && !is_operator(expression[i])) {
            left = expression[i] + left;
            i--;
        }

        i = index + 1;
        while (i < expression.length && !is_operator(expression[i])) {
            right += expression[i];
            i++;
        }

        const result = expression[index] === '*' ? parseFloat(left) * parseFloat(right) : parseFloat(left) / parseFloat(right);
        expression = expression.slice(0, index - left.length) + result + expression.slice(index + right.length + 1);

        if (show_work) steps.push(`After multiplication/division: ${expression}`);
        index = expression.search(/[*\/]/);
    }
    return expression;
}

// Function to handle addition and subtraction
function while_add_or_subtract(expression, show_work, steps = []) {
    let regex = /(-?\d+(\.\d+)?)([+\-])(-?\d+(\.\d+)?)/;
    let match = expression.match(regex);

    while (match) {
        const [fullMatch, left, _, operator, right] = match;
        const result = operator === '+' ? parseFloat(left) + parseFloat(right) : parseFloat(left) - parseFloat(right);

        const matchIndex = expression.indexOf(fullMatch);
        expression = expression.slice(0, matchIndex) + result + expression.slice(matchIndex + fullMatch.length);

        if (show_work) steps.push(`After addition/subtraction: ${expression}`);
        match = expression.match(regex);
    }
    return expression;
}

// Function to validate an expression
function is_valid_expression(expression) {
    return /^[0-9+\-*/^().\s]+$/.test(expression);
}