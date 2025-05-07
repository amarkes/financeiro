export default class ResponseSanitizer {
  public static sanitize(model: any, hiddenFields: string[] = []) {
    const serialized = model.toJSON ? model.toJSON() : model

    hiddenFields.forEach((field) => {
      delete serialized[field]
    })

    return serialized
  }
}
