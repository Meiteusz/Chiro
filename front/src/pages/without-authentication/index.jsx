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
    const [layoutTimeline, setLayoutTimeline] = useState();
    const [layoutCustomPropsTimeline, setLayoutCustomPropsTimeline] = useState();
    const [canDragBubbles, setCanDragBubbles] = useState(false);

    const ReactGridLayout = WidthProvider(RGL);
    let { projectId } = 0;

    const handleGetProject = async (param) => {
        try {
            projectId = await BoardWithoutAuthenticationService.getProjectWithToken(param);

            if (projectId) {
                const res = await ProjectService.getById(projectId);
                res.data.boardActions.forEach((boardActions) => {
                    console.log(boardActions)
                    handleAddBubbles({
                        width: boardActions.width,
                        height: boardActions.height,
                        x: boardActions.positionX,
                        y: boardActions.positionY,
                        id: boardActions.id.toString(),
                        content: boardActions.content,
                        color: boardActions.color,
                    });

                    handleConfirmStartEndDate({
                        startDate: boardActions.startDate,
                        endDate: boardActions.endDate,
                        id: boardActions.id.toString(),
                        content: boardActions.content,
                        color: boardActions.color,     
                    })
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

    const handleConfirmStartEndDate = ({startDate, endDate, id, content, color}) => {
        console.log({startDate, endDate, id, content, color})
        if (!startDate && !endDate) return;

        var dateCurrentYear = new Date("2024-01-01");
        var dayStart = Math.abs(new Date(startDate) - dateCurrentYear);
        var differenceDays = Math.floor(dayStart / (1000 * 60 * 60 * 24));

        var differenceInMilliseconds = Math.abs(
            new Date(endDate) - new Date(startDate)
          );

        var differenceInDays = Math.ceil(
            differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1
          );

        const newItem = {
            x: differenceDays,
            y: 0,
            w: differenceInDays,
            h: 1,
            i: id.toString(),
        };
    
        const newCustomProps = {
            bubbleId: newItem.i,
            type: 0,
            title: content,
            color: color,
            startsDate: new Date(startDate),
            endsDate: new Date(endDate),
            trace: false,
        };

        setLayoutTimeline(newItem);
        setLayoutCustomPropsTimeline(newCustomProps);
        
        /*var bubbleSelectedToTrace = layout.find((x) => x.i === id.toString());
        var selectedBubbleCustomPropsToTrace = layoutCustomProps.find(
            (x) => x.bubbleId === id.toString()
        );

        setLayout((prevLayout) =>
            prevLayout.filter((item) => item.i !== id.toString())
        );
        setLayoutCustomProps((prevLayout) =>
            prevLayout.filter((item) => item.bubbleId !== id.toString())
        );

        const newItemRastro = {
            w: bubbleSelectedToTrace.w,
            h: bubbleSelectedToTrace.h,
            x: bubbleSelectedToTrace.x,
            y: bubbleSelectedToTrace.y,
            i: bubbleSelectedToTrace.i,
            minW: bubbleSelectedToTrace.minW,
            maxW: bubbleSelectedToTrace.maxW,
            minH: bubbleSelectedToTrace.minH,
            maxH: bubbleSelectedToTrace.maxH,
        };
    
        const newCustomPropsRastro = {
            bubbleId: bubbleSelectedToTrace.i,
            title: selectedBubbleCustomPropsToTrace.title,
            color: selectedBubbleCustomPropsToTrace.color,
            startsDate: selectedBubbleCustomPropsToTrace.startsDate,
            endsDate: selectedBubbleCustomPropsToTrace.endsDate,
            trace: true,
        };

        setLayout((prevLayout) => [...prevLayout, newItemRastro]);
        setLayoutCustomProps((prevCustomProps) => [
            ...prevCustomProps,
            newCustomPropsRastro,
        ]);*/
    }

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
                    layoutBubble={layoutTimeline}
                    layoutBubbleProps={layoutCustomPropsTimeline}
                />
            </div>
        </div>
    );
}

export default BoardWithOutAuthentication;
