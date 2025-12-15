var isValid = function (input) {
  const stack = [];
  for (let c of input) {
    if (stack.length) {
      let last = stack[stack.length - 1];
      if (isPair(last, c)) {
        stack.pop();
        continue;
      }
    } else stack.push(c);
  }
  //   console.log(stack, "stack");
  return stack.length === 0;
};
function isPair(last, cur) {
  if (last == "{" && cur == "}") return true;
  else if (last == "[" && cur == "]") return true;
  else if (last == "(" && cur == ")") return true;
  return false;
}

const imput = "([P])";
console.log(isValid(imput));
