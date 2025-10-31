export const buildUrl = (props: { baseUrl: string, optionArr?: OptionsStr[] }) => {
  let { baseUrl, optionArr } = props;

  if (!optionArr)
    return baseUrl

  if (optionArr && optionArr.length > 0)
    baseUrl = baseUrl + '?'

  optionArr.forEach(element => {
    baseUrl = baseUrl + element.key + '=' + element.value.toString()
  });
  return baseUrl
}