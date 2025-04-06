#include <iostream>
#include <string>
#include <cmath>


bool is_number(std::string str) {
	// A valid number must contain at least one digit and at most one
	// decimal point
	int num_digits = 0;
	int num_points = 0;
	for (int i = 0; i < str.length(); i++) {
		bool is_point = str.at(i) == '.';
		// A negative sign is a dash at the beginning of the string
		bool is_negative_sign = str.at(i) == '-' && i == 0;
		bool is_number = str.at(i) >= '0' && str.at(i) <= '9';

		if (is_point) {
			// If the character is a decimal point, increment
			// the number of points found, and return false if
			// it's greater than 1
			num_points++;
			if (num_points > 1) {				
				return false;
			}
		}
		if (is_number) {
			// If the character is a digit, increment the number of
			// digits found
			num_digits++;
		}

		// If the character isn't any of the three valid possibilities,
		// return false, immediately ending the function
		if (!is_point && !is_negative_sign && !is_number) {
			return false;
		}
	}

	// Return true only if at least one digit was found
	return num_digits > 0;
}


int determine_size_array(std::string str){
	int count = 0;
	for (int i = 0; i < str.length(); i++){
		if (str.at(i) == ' '){
			count ++;
		}
	}
	return count + 1;
}


std::string* convert_to_array(std::string str, int size_array){
	// creates the new array
	std::string* converted_array = new std::string[size_array]; 
	int current_position = 0;

	for (int i = 0; i < size_array; i++){
		// if there is another space, split the from after the space to
		// the next space
		if (str.find(" ") != std::string::npos){ 
			int space_position = str.find(" ");
			converted_array[i] = str.substr(0, space_position);
			str.erase(0, space_position + 1);
		}
		else{ // the left over of the string goes in the final element
			converted_array[i] = str;
		}
	}
	return converted_array;
}


std::string* shift(std::string* array, int size ,int i){
	for (int j = i; j < size; j++){
		if (j < size - 2){ // shifts the rest of the array two spaces
			array[j] = array[j + 2];
		}
		else{ // leaves the end of the array blank
			array[j] = "";
		}
	}
	return array;
}


bool is_opperator(std::string str){
	if (str == "+" || str == "-" || str == "*" || str == "/" || str == "^"){
		return true;
	}
	else {
		return false;
	}
}


bool correct_order(std::string arr[], int size_array){
	for (int i = 0; i < size_array; i++){
		// if it is an even position it should be a number
		if (i % 2 == 0 && !is_number(arr[i])){
			return false;
		}
		// if it is an odd position it should be an opperator
		if (i % 2 == 1 && !is_opperator(arr[i])){
			return false;
		}
	}
	// the last value in the array should be a number
	if (!is_number(arr[size_array - 1])){
		return false;
	}
	return true;
}


bool is_valid_expression(std::string expression) {
	// determines how big the array needs to be
	int size = determine_size_array(expression);
	// converts the string expression into the array
	std::string* array = convert_to_array(expression, size);
	// returns true if it is the correct order and false if it isn't
	return correct_order(array, size);
}


bool contains_power(std::string* array, int size){
	for (int i = 0; i < size; i++){
		if (array[i] == "^"){
			return true;
		}
	}
	return false;
}


bool contains_multiply(std::string* array, int size){
	for (int i = 0; i < size; i++){
		if (array[i] == "*"){
			return true;
		}
	}
	return false;
}


bool contains_divide(std::string* array, int size){
	for (int i = 0; i < size; i++){
		if (array[i] == "/"){
			return true;
		}
	}
	return false;
}


bool contains_add(std::string* array, int size){
	for (int i = 0; i < size; i++){
		if (array[i] == "+"){
			return true;
		}
	}
	return false;
}


bool contains_subtract(std::string* array, int size){
	for (int i = 0; i < size; i++){
		if (array[i] == "-"){
			return true;
		}
	}
	return false;
}

void print_expression(std::string* array, int size) {
    for (int i = 0; i < size; i++) {
        if (!array[i].empty()) {
            std::cout << array[i] << " ";
        }
    }
    std::cout << std::endl;
}

std::string* while_power(std::string* array, int size){
	// continues while there is a "^" in the array
	while(contains_power(array, size)){
		for (int i = 0; i < size; i++){
			if (array[i] == "^"){
				double left = std::stod(array[i - 1]);
				double right = std::stod(array[i + 1]);
				// calculates left to the right power
				array[i - 1] = std::to_string(pow(left, right));
				// shift the array to the left
				shift(array, size, i);
			}
		}
        //print_expression(array, size); 
	}
	return array;
}


std::string* while_multiply_or_divide(std::string* array, int size){
	// continues while there is a "*" or "/" in the array
	while(contains_multiply(array, size) || contains_divide(array, size)){
		for (int i = 0; i < size; i++){
			if (array[i] == "*" || array[i] == "/"){
				double left = std::stod(array[i - 1]);
				double right = std::stod(array[i + 1]);
				if(array[i] == "*"){
					// calculates left times right
					array[i - 1] = std::to_string(left * 
						right);
					// shifts array to the left
					shift(array, size, i);
				}
				else {
					// calcualtes left divided by right
					array[i - 1] = std::to_string(left / 
						right);
					// shifts array to the left
					shift(array, size, i);
				}
			}
		}
        //print_expression(array, size);
	}
	return array;
}


std::string* while_add_or_subtract(std::string* array, int size){
	// continues while there is still "+" or "-" in array
	while(contains_add(array, size) || contains_subtract(array, size)){
		for (int i = 0; i < size; i++){
			if (array[i] == "+" || array[i] == "-") {			
				double left = std::stod(array[i - 1]);
				double right = std::stod(array[i + 1]);
				if (array[i] == "+"){
					// calculates left plus right
					array[i - 1] = std::to_string(left + 
						right);
					// shifts array to the left
					shift(array, size, i);
				}
				else if (array[i] == "-"){
					// calculates left minus right
					array[i - 1] = std::to_string(left - 
						right);
					// shifts array to the left
					shift(array, size, i);
				}
			}
		}
        //print_expression(array, size);
	}
	return array;
}


double compute_value(std::string expression) {
	int size = determine_size_array(expression);
	std::string* array = convert_to_array(expression, size);
	
	// updates the array doing the exponents first, then multiplicaiton /
	// division, then addition / subtraction
	array = while_power(array, size);
	array = while_multiply_or_divide(array, size);
	array = while_add_or_subtract(array, size);
	
	// the total value would end up in the first array position
	double total = std::stod(array[0]);

	delete[] array;
	return total;	
}