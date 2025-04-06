// returns true if the string is an operator
function is_operator(str) {
    if (str === '+' || str === '-' || str === '*' || str === '/' || 
            str === '^') {
        return true;
    }
    return false;
}

function is_definitely_operator(str) {
    if (str === '+' || str === '*' || str === '/' || 
            str === '^') {
        return true;
    }
    return false;
}

function is_operator_or_parenthesis(str) {
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

// determines if the expression is valid
function is_valid_expression(expression) {
    // if the expression is empty or null, return false
    if (!expression || expression.length === 0) {
        return false;
    }

    // if the expression contains unsupported characters, return false
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (!is_number(char) && char !== '.' && !is_operator(char) && 
                char !== '(' && char !== ')') { 
            return false;
        }
    }

    for (let i = 0; i < expression.length - 1; i++) {
        const curr = expression[i];
        const next = expression[i + 1];

        // Invalid: two definite operators in a row like ++ or **/
        if (is_definitely_operator(curr) && is_definitely_operator(next)) {
            return false;
        }

        // Invalid: ) followed by a number or (
        if (curr === ')' && (/[0-9(]/.test(next))) {
            return false;
        }

        // Invalid: number followed directly by (
        if (/[0-9]/.test(curr) && next === '(') {
            return false;
        }

        // Invalid: ) followed by (
        if (curr === ')' && next === '(') {
            return false;
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

// will print expression
function print_expression(expression) {
    const stepsDiv = document.getElementById('steps'); 
    const step = expression; 
    stepsDiv.innerHTML += `<p>${step}</p>`; 
    console.log(step); 
}

// while the string contains exponents, calculate exponent
function exponent(expression) {
    let index = expression.indexOf('^');
    // find the base and exponent
    let base = '';
    let exponent = '';
    let i = index - 1;

    // get the base
    while (i >= 0 && !is_definitely_operator(expression[i]) && 
            expression[i] !== '(') {
        base = expression[i] + base;
        i--;
    }

    i = index + 1;
    while (i < expression.length && !is_definitely_operator(expression[i]) && 
            expression[i] !== ')') {
        exponent += expression[i];
        i++;
    }

    const result = Math.pow(parseFloat(base), parseFloat(exponent));

        // replace the base^exponent in the original expression
    expression = expression.slice(0, index - base.length) + result + 
        expression.slice(index + exponent.length + 1);
        
    return expression;
}

// while the string contains multiplication or division
function multiply_or_divide(expression) {
    let index = expression.search(/[*\/]/);
    let left = '';
    let right = '';
    let i = index - 1;

    // get the left operand
    while (i >= 0 && !is_definitely_operator(expression[i]) && 
            expression[i] !== '(') {
        left = expression[i] + left;
        i--;
    }

    i = index + 1;

    while (i < expression.length && !is_definitely_operator(expression[i]) &&
            expression[i] !== ')') {
        right += expression[i];
        i++;
    }

    // calculate the result of left and right
    const result = expression[index] === '*' ? 
        parseFloat(left) * parseFloat(right) : 
        parseFloat(left) / parseFloat(right);

    // replace the left and right in the original expression
    expression = expression.slice(0, index - left.length) + result + 
            expression.slice(index + right.length + 1);

    return expression;
}


// while the string contains addition or subtraction, calculate the result of those operations first
// Function to handle addition/subtraction - the main issue is here
function add_or_subtract(expression) {
    // Handle multiple operations left to right instead of using regex
    let result = expression;
    
    // First, normalize consecutive operators
    let i = 0;
    while (i < result.length - 1) {
        if (result[i] === '+' && result[i + 1] === '-') {
            result = result.slice(0, i) + '-' + result.slice(i + 2);
        } else if (result[i] === '-' && result[i + 1] === '-') {
            result = result.slice(0, i) + '+' + result.slice(i + 2);
        } else if (result[i] === '-' && result[i + 1] === '+') {
            result = result.slice(0, i) + '-' + result.slice(i + 2);
        } else if (result[i] === '+' && result[i + 1] === '+') {
            result = result.slice(0, i) + '+' + result.slice(i + 2);
        } else {
            i++;
        }
    }
    
    // Find the first + or - that's not at the beginning of the expression
    // and not part of a negative number
    let opIndex = -1;
    for (i = 1; i < result.length; i++) {
        if ((result[i] === '+' || result[i] === '-') && 
            !is_operator(result[i-1]) && result[i-1] !== '(') {
            opIndex = i;
            break;
        }
    }
    
    if (opIndex === -1) return result; // No operation found
    
    // Extract the left and right parts
    const left = result.substring(0, opIndex);
    const operator = result[opIndex];
    const right = result.substring(opIndex + 1);
    
    // Find where the next number ends
    let rightNumberEnd = right.length;
    for (i = 0; i < right.length; i++) {
        if (is_operator(right[i]) && i > 0 && !is_operator(right[i-1])) {
            rightNumberEnd = i;
            break;
        }
    }
    
    const leftValue = parseFloat(left);
    const rightValue = parseFloat(right.substring(0, rightNumberEnd));
    
    if (isNaN(leftValue) || isNaN(rightValue)) {
        throw new Error(`Invalid operation: ${left}${operator}${right.substring(0, rightNumberEnd)}`);
    }
    
    // Calculate the result
    let calcResult;
    if (operator === '+') {
        calcResult = leftValue + rightValue;
    } else {
        calcResult = leftValue - rightValue;
    }
    
    // Return the result joined with any remaining part of the expression
    return calcResult + right.substring(rightNumberEnd);
}

// Update while_parentheses to handle multiple operations correctly
function while_parentheses(expression, show_work) {
    let open_parenthesis = expression.lastIndexOf('(');
    while (open_parenthesis !== -1) {
        let close_parenthesis = expression.indexOf(')', open_parenthesis);
        if (close_parenthesis === -1) {
            throw new Error("Mismatched parentheses");
        }

        // Extract the sub-expression inside the parentheses
        let sub_expression = expression.slice(open_parenthesis + 1, close_parenthesis);
        
        // Evaluate the sub-expression step by step
        // First handle exponents
        while (sub_expression.includes('^')) {
            sub_expression = exponent(sub_expression);
            if (show_work) {
                print_expression(expression.slice(0, open_parenthesis) + 
                               `(${sub_expression})` + 
                               expression.slice(close_parenthesis + 1));
            }
        }
        
        // Then handle multiplication and division
        while (sub_expression.includes('*') || sub_expression.includes('/')) {
            sub_expression = multiply_or_divide(sub_expression);
            if (show_work) {
                print_expression(expression.slice(0, open_parenthesis) + 
                               `(${sub_expression})` + 
                               expression.slice(close_parenthesis + 1));
            }
        }
        
        // Finally handle addition and subtraction - loop to handle multiple operations
        while (sub_expression.includes('+') || (sub_expression.includes('-') && 
                sub_expression.search(/[0-9]-/) !== -1)) {
            const before = sub_expression;
            sub_expression = add_or_subtract(sub_expression);
            if (before === sub_expression) break; // No change made, prevent infinite loop
            
            if (show_work) {
                print_expression(expression.slice(0, open_parenthesis) + 
                               `(${sub_expression})` + 
                               expression.slice(close_parenthesis + 1));
            }
        }

        // Replace the sub-expression in the original expression
        expression = expression.slice(0, open_parenthesis) + sub_expression + 
                     expression.slice(close_parenthesis + 1);

        // Print the updated expression after replacing the parentheses
        if (show_work) {
            print_expression(expression);
        }

        // Find the next set of parentheses
        open_parenthesis = expression.lastIndexOf('(');
    }
    
    return expression;
}

// Update compute_value for consistency with our parentheses changes
function compute_value(expression, show_work) {
    try {
        // Remove whitespace
        expression = expression.replace(/\s/g, '');
        console.log("Initial expression:", expression);

        if (show_work) {
            print_expression(expression);
        }

        // Validate the expression
        if (!is_valid_expression(expression)) {
            throw new Error("Invalid expression");
        }

        // Evaluate parentheses first
        expression = while_parentheses(expression, show_work);

        // Evaluate exponents
        while (expression.includes('^')) {
            expression = exponent(expression);
            if (show_work) {
                print_expression(expression);
            }
        }

        // Evaluate multiplication and division
        while (expression.includes('*') || expression.includes('/')) {
            expression = multiply_or_divide(expression);
            if (show_work) {
                print_expression(expression);
            }
        }

        // Evaluate addition and subtraction - loop to handle multiple operations
        while (expression.includes('+') || 
               (expression.includes('-') && expression.search(/[0-9]-/) !== -1)) {
            const before = expression;
            expression = add_or_subtract(expression);
            if (before === expression) break; // No change made, prevent infinite loop
            
            if (show_work) {
                print_expression(expression);
            }
        }

        // Parse the final result
        const result = parseFloat(expression);
        if (isNaN(result)) {
            throw new Error("Calculation resulted in an invalid number");
        }

        console.log("Final result:", result);
        return result;
    } catch (error) {
        console.error("Error in compute_value:", error.message);
        throw error;
    }
}

export { compute_value };