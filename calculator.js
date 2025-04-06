document.getElementById('calculate').addEventListener('click', () => {
    const expression = document.getElementById('expression').value;

    try {
        const result = eval(expression); // Use eval carefully; sanitize input in production
        document.getElementById('result').textContent = `Result: ${result}`;
    } catch (error) {
        document.getElementById('result').textContent = 'Invalid Expression!';
    }
});