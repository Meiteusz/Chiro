import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

import BoardWithoutAuthenticationService from "../../services/requests/board-without-authentication-service";

function BoardWithOutAuthentication () {
    const router = useRouter();
    const { param } = router.query;
    const [paramValue, setParamValue] = useState('');

    const handleGetProject = async (param) => {
        const projectId = await BoardWithoutAuthenticationService.getProjectWithToken(param);
        console.log(projectId);
      };

    useEffect(() => {
        if (param) {
          setParamValue(param);
        }
      }, [param]);

      useEffect(() => {
        if (paramValue)
        {
            handleGetProject(paramValue);
        }
      }, [paramValue]);

    return (
        <>
            <h1>{param}</h1>
        </>
    );
}

export default BoardWithOutAuthentication;