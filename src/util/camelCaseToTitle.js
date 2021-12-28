function camelCaseToTitle(str) {
  return str[0].toUpperCase() + str.substring(1).split(/(?=[A-Z])/).join(" ");
}

export default camelCaseToTitle;
