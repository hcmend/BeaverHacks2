// returns true if the string is an operator
function is_operator(str) {
    if (str === '+' || str === '-' || str === '*' || str === '/' || 
            str === '^' || str === '(' || str === ')') {
        return true;
    }
    return false;
}

// returns true if the it is a number
function is_number(str) {
    let num_digit = 0;
    let num_points = 0;

    for (let i = 0; i < str.length; i++) {
        const is_point = str[i] === '.';
        const is_neg_sign = str[i] === '-' && (i === 0 || is_operator(str[i - 1]) || str[i - 1] === '(');
        const is_digit = str[i] >= '0' && str[i] <= '9';

        if (is_point) {
            num_points++;
            if (num_points > 1) {
                return false; // More than one decimal point is invalid
            }
        }
        if (is_digit) {
            num_digit++;
        }
        if (!is_point && !is_neg_sign && !is_digit) {
            return false; // Invalid character
        }
    }

    return num_digit > 0; // Must contain at least one digit
}

function is_negative_sign(expression, position) {
    // It's a negative sign if:
    // 1. It's at the beginning of the expression
    // 2. It follows an operator (except closing parenthesis)
    // 3. It follows an opening parenthesis
    if (expression[position] !== '-' && (position === 0  ||
        (is_operator(expression[position]) && expression[position] !== ')') ||
        expression[position-1] === '(')) {
        return false; // Not a negative sign in context
    }
}

// determines if the expression is valid
function is_valid_expression(expression) {
    // if the expression is empty or null, return false
    if (!expression || expression.length === 0) {
        return false;
    }

    // if the expression contains no numbers, return false
    let has_number = false;
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (is_number(char)) {
            has_number = true;
            break;
        }
    }
    if (!has_number) {
        return false; 
    }

    // if the expression contains unsupported characters, return false
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (!is_number(char) && !is_operator(char)) { 
            return false;
        }
    }

    for (let i = 0; i < expression.length - 1; i++) {
        const char = expression[i];
        if (is_operator(expression[i]) && is_operator(expression[i + 1])) { 
            if (char !== '-' || expression[i + 1] !== '-') { 
                return false;
            }
        }
    }

    // if the expression at index 0 is an operator that isn't a negative sign
    // or open parenthesis, return false
    if (is_operator(expression[0]) && expression[0] !== '-' && 
            expression[0] !== '(') {
        return false;
    }

    // if the expression doesn't have the same number of opening and closing
    // parentheses, return false
    let num_open_parenthesis = 0;
    let num_close_parenthesis = 0;
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') {
            num_open_parenthesis++;
        }
        if (expression[i] === ')') {
            num_close_parenthesis++;
        }
    }
    if (num_open_parenthesis !== num_close_parenthesis) {
        return false; // mismatched parentheses
    }

    // if there is an operator (other than closing parenthesis) at the end of 
    // the expression, return false
    if (is_operator(expression[expression.length - 1]) && 
            expression[expression.length - 1] !== ')') {
        return false; 
    }

    return true;
}

function print_expression(expression) {
    const stepsDiv = document.getElementById('steps'); 
    const step = expression; 
    stepsDiv.innerHTML += `<p>${step}</p>`; 
    console.log(step); 
}

// while the string contains exponents, calculate exponent
function while_exponents(expression, show_work) {
    let index = expression.indexOf('^');
    while (index !== -1) {
        // find the base and exponent
        let base = '';
        let exponent = '';
        let i = index - 1;

        // get the base
        while (i >= 0 && !is_operator(expression[i]) && expression[i] !== '(') {
            base = expression[i] + base;
            i--;
        }

        i = index + 1;
        if (is_negative_sign(expression, i)) {
            exponent = '-';
            i++;
        }
        while (i < expression.length && !is_operator(expression[i]) && expression[i] !== ')') {
            exponent += expression[i];
            i++;
        }

        // calculate the result of base^exponent
        const result = Math.pow(parseFloat(base), parseFloat(exponent));

        // replace the base^exponent in the original expression
        expression = expression.slice(0, index - base.length) + result + 
            expression.slice(index + exponent.length + 1);
        
        if (show_work) {
            print_expression(expression);
        }

        index = expression.indexOf('^');
    }
    return expression;
}

// while the string contains multiplication or division, calculate the result of those operations first
function while_multiply_or_divide(expression, show_work) {
    let index = expression.search(/[*\/]/);
    while (index !== -1) {
        let left = '';
        let right = '';
        let i = index - 1;

        // get the left operand
        while (i >= 0 && !is_operator(expression[i]) && expression[i] !== '(') {
            left = expression[i] + left;
            i--;
        }

        i = index + 1;
        if (is_negative_sign(expression, i)) {
            right = '-';
            i++;
        }
        while (i < expression.length && !is_operator(expression[i]) && expression[i] !== ')') {
            right += expression[i];
            i++;
        }

        // calculate the result of left and right
        const result = expression[index] === '*' ? 
            parseFloat(left) * parseFloat(right) : 
            parseFloat(left) / parseFloat(right);

        // replace the left and right in the original expression
        expression = expression.slice(0, index - left.length) + result + expression.slice(index + right.length + 1);

        if (show_work) {
            print_expression(expression);
        }
        
        index = expression.search(/[*\/]/);
    }
    return expression;
}


// while the string contains addition or subtraction, calculate the result of those operations first
function while_add_or_subtract(expression, show_work) {
    let position = 0;
    let index = -1;

    // Find the next addition or subtraction operator (skip negative signs)
    while (position < expression.length) {
        if ((expression[position] === '+' || expression[position] === '-') && 
            !is_negative_sign(expression, position)) {
            index = position;
            break;
        }
        position++;
    }

    while (index !== -1) {
        let left = '';
        let right = '';
        let i = index - 1;

        // Get the left operand
        while (i >= 0 && !is_operator(expression[i]) && expression[i] !== '(') {
            left = expression[i] + left;
            i--;
        }

        i = index + 1;

        // Get the right operand (which might be a negative number)
        if (is_negative_sign(expression, i)) {
            right = '-';
            i++;
        }
        while (i < expression.length && !is_operator(expression[i]) && expression[i] !== ')') {
            right += expression[i];
            i++;
        }

        // Calculate the result of left and right
        const result = expression[index] === '+' ? 
            parseFloat(left) + parseFloat(right) : 
            parseFloat(left) - parseFloat(right);

        console.log(`Processing: ${left} ${expression[index]} ${right} = ${result}`);

        // Replace the operation in the original expression
        expression = expression.slice(0, index - left.length) + result + expression.slice(i);

        console.log(`Updated expression: ${expression}`);

        // Find the next addition or subtraction operator
        position = 0;
        index = -1;
        while (position < expression.length) {
            if ((expression[position] === '+' || expression[position] === '-') && 
                !is_negative_sign(expression, position)) {
                index = position;
                break;
            }
            position++;
        }

        if (show_work) {
            print_expression(expression);
        }
    }
    return expression;
}

// while the string contains parentheses, calculate the result of the expression inside the parentheses first
function while_parentheses(expression, show_work) {
    let open_parenthesis = expression.lastIndexOf('(');
    while (open_parenthesis !== -1) {
        let close_parenthesis = expression.indexOf(')', open_parenthesis);
        if (close_parenthesis === -1) {
            throw new Error("Mismatched parentheses");
        }

        // Extract the sub-expression inside the parentheses
        let sub_expression = expression.slice(open_parenthesis + 1, close_parenthesis);

        // Evaluate the sub-expression
        sub_expression = while_exponents(sub_expression, false);
        sub_expression = while_multiply_or_divide(sub_expression, false);
        sub_expression = while_add_or_subtract(sub_expression, false);

        // Replace the sub-expression in the original expression
        expression = expression.slice(0, open_parenthesis) + sub_expression + expression.slice(close_parenthesis + 1);

        open_parenthesis = expression.lastIndexOf('(');
        if (show_work) {
            print_expression(expression);
        }
    }
    
    return expression;
}

function compute_value(expression, show_work) {
    expression = expression.replace(/\s/g, '');
    console.log("Initial expression:", expression);
    
    // Validate the expression first
    if (!is_valid_expression(expression)) {
        throw new Error("Invalid expression");
    }

    expression = while_parentheses(expression, show_work);
    console.log("After while_parentheses:", expression);

    expression = while_exponents(expression, show_work);
    console.log("After while_exponents:", expression);

    expression = while_multiply_or_divide(expression, show_work);
    console.log("After while_multiply_or_divide:", expression);

    expression = while_add_or_subtract(expression, show_work);
    console.log("After while_add_or_subtract:", expression);

    const result = parseFloat(expression); 
    console.log("Final result:", result);

    return result;
}

export { compute_value };