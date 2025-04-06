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
        const steps = get_steps(problem); // Use the existing get_steps function
        const result = compute_value(problem, true); // Use the existing compute_value function
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