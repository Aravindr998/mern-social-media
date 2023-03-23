const isDescriptionValid = (description) => {
  const value = description.trim()
  if (!(value.length > 0)) {
    return false
  }
  return true
}

export const isPostValid = (post) => {
  const errors = {}
  if (!isDescriptionValid(post.description)) {
    errors.description = "Please enter a valid description"
  }
  console.log(post.description)
  if (!post.privacy) {
    errors.privacy = "Please select a privacy option"
  }
  const isValid = !Object.keys(errors).length
  return { isValid, errors }
}
