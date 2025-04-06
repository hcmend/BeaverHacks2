
function is_number(str) {
    let num_digit = 0;
    let num_points = 0;

    for (let i = 0; i < str.length; i++) {
        const is_point = str[i] === '.';
        const is_neg_sign = str[i] === '-' && i === 0;
        const is_digit = str[i] >= '0' && str[i] <= '9';

        if (is_point) {
            num_points++;
            if (num_points > 1) {
                return false;
            }
        }
        if (is_digit) {
            num_digit++;
        }
        if (!is_point && !is_neg_sign && !isDigit) {
            return false;
        }
    }

    return num_digit > 0;
}

function determine_size_array(str) {
    return str.split(' ').length;
}

function convert_to_array(str) {
    return str.split(' ');
}

function shift(array, size, i) {
    for (let j = i; j < size; j++) {
        if (j < size - 2) {
            array[j] = array[j + 2];
        } else {
            array[j] = '';
        }
    }
    return array;
}

function is_operator(str) {
    return ['+', '-', '*', '/', '^', '(', ')'].includes(str);
}

function correct_order(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0 && !is_number(arr[i])) {
            return false;
        }
        if (i % 2 === 1 && !is_operator(arr[i])) {
            return false;
        }
    }
    return is_number(arr[arr.length - 1]);
}

function is_valid_expression(expression) {
    const array = convert_to_array(expression);
    const open_parenthesis = array.lastIndexOf('(');
    const close_parenthesis = array.indexOf(')', open_parenthesis);
    if (open_parenthesis === -1 || close_parenthesis === -1) {
        return false;;
    }
    return correct_order(array);
}

function contains(array, operator) {
    return array.includes(operator);
}

function print_expression(array) {
    // come back to this one
    console.log(array.filter(item => item !== '').join(' '));
}

function while_power(array, show_work) {
    while (contains(array, '^')) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === '^') {
                const left = parseFloat(array[i - 1]);
                const right = parseFloat(array[i + 1]);
                array[i - 1] = Math.pow(left, right).toString();
                shift(array, array.length, i);
            }
        }
        if (show_work) {
            print_expression(array);
        }
    }
    return array;
}

function while_multiply_or_divide(array, show_work) {
    while (contains(array, '*') || contains(array, '/')) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === '*' || array[i] === '/') {
                const left = parseFloat(array[i - 1]);
                const right = parseFloat(array[i + 1]);
                if (array[i] === '*') {
                    array[i - 1] = (left * right).toString();
                } else {
                    array[i - 1] = (left / right).toString();
                }
                shift(array, array.length, i);
            }
        }
        if (show_work) {
            print_expression(array);
        }
    }
    return array;
}

function while_add_or_subtract(array, show_work) {
    while (contains(array, '+') || contains(array, '-')) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === '+' || array[i] === '-') {
                const left = parseFloat(array[i - 1]);
                const right = parseFloat(array[i + 1]);
                if (array[i] === '+') {
                    array[i - 1] = (left + right).toString();
                } else {
                    array[i - 1] = (left - right).toString();
                }
                shift(array, array.length, i);
            }
        }
        if (show_work) {
            print_expression(array);
        }
    }
    return array;
}

function while_parentheses(array, show_work) {
    while (array.includes('(')) {
        const open_parenthesis = array.lastIndexOf('('); 
        const close_parenthesis = array.indexOf(')', open_parenthesis); 
        const sub_array = array.slice(open_parenthesis + 1, close_parenthesis);

        while_power(sub_array, show_work);
        while_multiply_or_divide(sub_array, show_work);
        while_add_or_subtract(sub_array, show_work);

        const result = sub_array[0];
        array.splice(open_parenthesis, close_parenthesis - open_parenthesis + 1, result);

        if (show_work) {
            print_expression(array);
        }
    }

    return array;
}

function compute_value(expression, show_work) {
    const array = convert_to_array(expression);

    while_parentheses(array, show_work);
    while_power(array, show_work);
    while_multiply_or_divide(array, show_work);
    while_add_or_subtract(array, show_work);

    return parseFloat(array[0]);
}
