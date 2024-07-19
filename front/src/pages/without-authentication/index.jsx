import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import RGL, { WidthProvider } from "react-grid-layout";

import BoardWithoutAuthenticationService from "@/services/requests/board-without-authentication-service";
import ProjectService from "@/services/requests/project-service";
import Bubble from "@/components/bubble/bubble";
import Timeline from "@/components/timeline/timeline";
import Navbar from "@/components/navbar";

import "@/app/globals.css";
import "./styles.css";
import "../styles.css";


function BoardWithOutAuthentication () {
    const router = useRouter();
    const { param } = router.query;

    const [paramValue, setParamValue] = useState('');
    const [layout, setLayout] = useState([]);
    const [layoutCustomProps, setLayoutCustomProps] = useState([]);
    const [canDragBubbles, setCanDragBubbles] = useState(false);
    const [loadingBoard, setLoadingBoard] = useState();
    const [projectId, setProjectId] = useState(0);

    const ReactGridLayout = WidthProvider(RGL);

    const handleGetProject = async (param) => {
        try {
            const id = await BoardWithoutAuthenticationService.getProjectWithToken(param);
            setProjectId(id);

            if (id) {
                const res = await ProjectService.getById(id);
                res.data.boardActions.forEach((boardActions) => {
                    handleAddBubbles({
                        width: boardActions.width,
                        height: boardActions.height,
                        x: boardActions.positionX,
                        y: boardActions.positionY,
                        id: boardActions.id.toString(),
                        content: boardActions.content,
                        color: boardActions.color,
                    });   
                });
            }
        } catch (error) {
            console.error("Erro ao obter o ID do projeto:", error);
        }
    };

    const handleAddBubbles = ({width, height, x, y, id, content, color}) => {
        const newItem = {
            w: width,
            h: height,
            x: x,
            y: y,
            i: id,
            minW: 4,
            maxW: 10,
            minH: 2,
            maxH: 5,
        };

        const newCustomProps = {
            bubbleId: newItem.i,
            title: content,
            color: color,
            startsDate: null,
            endsDate: null,
            trace: false,
        };

        setLayout((prevLayout) => [...prevLayout, newItem]);
        setLayoutCustomProps((prevCustomProps) => [...prevCustomProps, newCustomProps]);
    };

    const onBubbleLoad = (bubble) => {
        if (!bubble.startDate && !bubble.endDate) {
          return;
        }

        const newItemRastro = {
          w: bubble.width,
          h: bubble.height,
          x: bubble.positionX,
          y: bubble.positionY,
          i: bubble.id.toString(),
          minW: 4,
          maxW: 10,
          minH: 2,
          maxH: 5,
        };
    
        const newCustomPropsRastro = {
          bubbleId: newItemRastro.i,
          title: bubble.content,
          color: bubble.color,
          startsDate: new Date(bubble.startDate),
          endsDate: new Date(bubble.endDate),
          trace: true,
        };
    
        setLayout((prevLayout) => [...prevLayout, newItemRastro]);
        setLayoutCustomProps((prevCustomProps) => [
          ...prevCustomProps,
          newCustomPropsRastro,
        ]);
      };

    useEffect(() => {
        if (param) {
            setParamValue(param);
        }
    }, [param]);

    useEffect(() => {
        if (paramValue) {
            handleGetProject(paramValue);
        }
    }, [paramValue]);

    return (
        <div className="container-boards">
            <Navbar projectName="Projeto" />
            <div className="top-board">
                <ReactGridLayout
                    isResizable={false}
                    layout={layout}
                    compactType={null}
                    isDraggable={canDragBubbles}
                    margin={[1, 1]}
                    rowHeight={25}
                    cols={50}
                    containerPadding={[0, 0]}
                    maxRows={23.3}
                    style={{ height: "100%" }}
                >
                    {layout.map((bubble) => (
                        <div key={bubble.i} style={{ borderRadius: "5px" }}>
                            <Bubble
                                bubble={bubble}
                                bubbleCustomProps={
                                    layoutCustomProps &&
                                    layoutCustomProps.find((x) => x.bubbleId === bubble.i)
                                }
                                notAuthenticate={true}
                            />
                        </div>
                    ))}
                </ReactGridLayout>
            </div>
            <div id="timeline" className="time-line">
                <Timeline
                    bubbleProjectId={projectId}
                    loadingBoard={loadingBoard}
                    onBubbleLoad={onBubbleLoad}
                    notAuthenticate={true}
                />
            </div>
        </div>
    );
}

export default BoardWithOutAuthentication;