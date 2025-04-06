function generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    return `${num1} ${operator} ${num2}`;
}

document.getElementById('generate').addEventListener('click', () => {
    const problemsContainer = document.getElementById('problems');
    problemsContainer.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const problem = generateProblem();
        const problemElement = document.createElement('p');
        problemElement.textContent = problem;
        problemsContainer.appendChild(problemElement);
    }
});