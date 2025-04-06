function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem() {
    const operators = ['+', '-', '*', '/'];
    const numTerms = getRandomNumber(2, 4); 
    let problem = '';

    for (let i = 0; i < numTerms; i++) {
        const number = getRandomNumber(1, 20);
        problem += number;

        if (i < numTerms - 1) {
            const operator = operators[getRandomNumber(0, operators.length - 1)];
            problem += ` ${operator} `;
        }
    }

    if (Math.random() > 0.5) {
        const parts = problem.split(' ');

        // Ensure parentheses are placed around valid sub-expressions
        let start = getRandomNumber(0, parts.length - 3);
        while (is_operator(parts[start]) || is_operator(parts[start + 2])) {
            start = getRandomNumber(0, parts.length - 3); // Retry until valid
        }

        const end = start + 2;
        parts[start] = `(${parts[start]}`;
        parts[end] = `${parts[end]})`;
        problem = parts.join(' ');
    }

    return problem;
}

// Helper function to check if a string is an operator
function is_operator(str) {
    return ['+', '-', '*', '/'].includes(str);
}

// Function to display problems
function displayProblems() {
    const problemsDiv = document.getElementById('problems');
    problemsDiv.innerHTML = ''; 

    for (let i = 0; i < 5; i++) { 
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

function showSolution(problem, index) {
    const solutionDiv = document.getElementById(`solution-${index}`);
    try {
        const steps = get_steps(problem); 
        const result = compute_value(problem, true); 
        solutionDiv.innerHTML = `
            <p><strong>Steps:</strong></p>
            <p>${steps.replace(/\n/g, '<br>')}</p>
            <p><strong>Solution:</strong> ${result}</p>
        `;
    } catch (error) {
        solutionDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

document.getElementById('generate').addEventListener('click', displayProblems);

document.addEventListener('DOMContentLoaded', displayProblems);

function is_operator(str) {
    return ['+', '-', '*', '/', '^'].includes(str);
}

function is_number(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

function compute_value(expression, show_work) {
    expression = expression.replace(/\s/g, '');
    if (!is_valid_expression(expression)) {
        throw new Error("Invalid expression");
    }

    expression = while_parentheses(expression, show_work);
    expression = while_exponents(expression, show_work);
    expression = while_multiply_or_divide(expression, show_work);
    expression = while_add_or_subtract(expression, show_work);

    return parseFloat(expression);
}

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

function is_valid_expression(expression) {
    return /^[0-9+\-*/^().\s]+$/.test(expression);
}