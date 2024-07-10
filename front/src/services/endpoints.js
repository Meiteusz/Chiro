const LOCALHOST = `https://localhost:7170/api/v1/`;

const ENDPOINTS = {
  auth: {
    base: `auth`,
    authenticate: `auth/authenticate`,
  },
  boardAction: {
    base: `board-action`,
    changeColor: `board-action/change-color`,
    resize: `board-action/resize`,
    move: `board-action/move`,
    changePeriod: `board-action/change-period`,
    conclude: `board-action/conclude`,
    link: `board-action/link`,
    delete: (id) => `board-action/${id}`,
    changeContent: `board-action/change-content`
  },
  project: {
    base: `project`,
    getById: (id) => `project/${id}`,
    changeColor: `project/change-color`,
    resize: `project/resize`,
    move: `project/move`,
    delete: (id) => `project/${id}`,
    changeName: `project/change-name`,
    getTimelinePeriod: (id) => `project/timeline-period/${id}`
  },
  boardWithoutAuthentication: {
    createLink: (projectId, randomNumbers) => `board-without-authentication/create-link?projectId=${projectId}&randomNumbers=${randomNumbers}`,
    getProjectWithToken: (token) => `board-without-authentication/get-project-with-token?token=${token}`
  },
};

export { LOCALHOST, ENDPOINTS };
