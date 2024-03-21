const API_RESPONSE = (dataParam = null, titleParam = '', messageParam = '', successParam = false, codeParam = 400) => {
    let response = {
      data: dataParam,
      title: titleParam,
      message: messageParam,
      success: successParam,
      code: codeParam
    };
    return response;
}

export default API_RESPONSE;