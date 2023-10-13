/** arcoDesign 下拉选搜索条件判断 */
export function filterOption(inputValue: string, option: any) {
  try {
    if (option.props?.children?.props?.text) {
      return (
        option.props.children.props.text
          ?.toLowerCase()
          ?.indexOf(inputValue.toLowerCase()) >= 0
      );
    } else if (option.props?.children) {
      return (
        option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
        0
      );
    } else if (option.props.value) {
      return (
        option.props.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      );
    }
  } catch (error) {
    return false;
  }
}
