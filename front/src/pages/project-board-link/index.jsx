import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RGL, { WidthProvider } from "react-grid-layout";

import BoardWithoutAuthenticationService from "@/services/requests/board-without-authentication-service";
import ProjectService from "@/services/requests/project-service";
import Bubble from "@/components/bubble/bubble";
import Timeline from "@/components/timeline/timeline";
import Navbar from "@/components/navbar/navbar";
import Loading from "@/components/loading/Loading";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useError } from "@/components/context/error-network";

import "./styles.css";
import "@/app/globals.css";
import "../../../node_modules/react-grid-layout/css/styles.css";

function BoardWithOutAuthentication() {
  const router = useRouter();
  const { param } = router.query;

  const [loading, setLoading] = useState(false);
  const [paramValue, setParamValue] = useState("");
  const [layout, setLayout] = useState([]);
  const [layoutCustomProps, setLayoutCustomProps] = useState([]);
  const [projectId, setProjectId] = useState(0);
  const [projectName, setProjectName] = useState("");
  const { setErrorNetwork } = useError();
  const [error, setError] = useState("");
  const [defaultScale, setDefaultScale] = useState(0.2);
  const [layoutTimeline, setLayoutTimeline] = useState();
  const [layoutCustomPropsTimeline, setLayoutCustomPropsTimeline] = useState();
  const [startTimelinePeriod, setStartTimelinePeriod] = useState(null);
  const [bubbleBeingDeleted, setBubbleBeingDeleted] = useState();
  const [bubbleContentChanged, setBubbleContentChanged] = useState();
  const [bubbleColorChanged, setBubbleColorChanged] = useState();

  const ReactGridLayout = WidthProvider(RGL);

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

  const handleGetProject = (param) => {
    BoardWithoutAuthenticationService.getProjectWithToken(param)
      .then((res) => {
        setErrorNetwork(null);
        setProjectId(res);
        if (res) {
          setLoading(true);
          ProjectService.getProjectName(res)
            .then((res) => {
              setErrorNetwork(null);
              setProjectName(res.data);
            })
            .catch((error) => {
              console.error("Error fetching project name: ", error);
              setErrorNetwork(error.code);
            });

          ProjectService.getById(res)
            .then((res) => {
              setErrorNetwork(null);

              res.data.boardActions.forEach((boardActions) => {
                handleAddBubbles({
                  width: boardActions.width,
                  height: boardActions.height,
                  x: boardActions.positionX,
                  y: boardActions.positionY,
                  id: boardActions.id.toString(),
                  content: boardActions.content,
                  color: boardActions.color,
                  type: boardActions.boardActionType,
                  startDate: boardActions.startDate,
                  endDate: boardActions.endDate,
                });
              });
            })
            .catch((error) => {
              console.error("Error fetching project: ", error);
              setErrorNetwork(error.code);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        console.log("Error fetching project by token: ", error.response.data);
        setError(error.response.data.message + error.response.data.error);
        setErrorNetwork(error.code);
      });
  };

  const handleAddBubbles = ({
    width,
    height,
    x,
    y,
    id,
    content,
    color,
    type,
    startDate,
    endDate,
  }) => {
    const newItem = {
      w: width,
      h: height,
      x: x,
      y: y,
      i: id,
      minW: 4,
      maxW: 100,
      minH: 8,
      maxH: 25,
      static: true,
    };

    const newCustomProps = {
      bubbleId: newItem.i,
      title: content,
      color: color,
      type: type,
      startsDate: new Date(startDate),
      endsDate: new Date(endDate),
      trace: startDate && endDate,
    };

    setLayout((prevLayout) => [...prevLayout, newItem]);
    setLayoutCustomProps((prevCustomProps) => [
      ...prevCustomProps,
      newCustomProps,
    ]);
  };

  const handleScroll = (e) => {
    setDefaultScale(e.state.scale);
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Navbar projectName={projectName} />
      <div className="container-boards">
        {error && (
          <h1
            style={{ textAlign: "center", fontSize: "3rem", marginTop: "20vh" }}
          >
            {error}
          </h1>
        )}
        <div className="top-board">
          <TransformWrapper
            initialPositionY={1}
            initialPositionX={1}
            maxScale={5}
            minScale={0.2}
            doubleClick={{ disabled: true }}
            alignmentAnimation={{ disabled: false }}
            limitToBounds={true}
            centerOnInit={false}
            centerZoomedOut={true}
            disablePadding={false}
            defaultScale={defaultScale}
            initialScale={defaultScale}
            onWheel={handleScroll}
            panning={{
              disabled: false,
              velocityDisabled: true,
            }}
          >
            <TransformComponent>
              <ReactGridLayout
                layout={layout}
                compactType={null}
                isDraggable={false}
                margin={[1, 1]}
                rowHeight={10}
                cols={1000}
                maxRows={636.7}
                style={{
                  width: "8000px !important",
                  height: "7008px !important",
                  position: "fixed",
                }}
                transformScale={defaultScale}
              >
                {layout
                  .filter(
                    (bubble, index, self) =>
                      index === self.findIndex((t) => t.i === bubble.i)
                  )
                  .map((bubble) => {
                    return (
                      <div key={bubble.i} style={{ borderRadius: "5px" }}>
                        <Bubble
                          bubble={bubble}
                          bubbleCustomProps={
                            layoutCustomProps &&
                            layoutCustomProps.find(
                              (x) => x.bubbleId === bubble.i
                            )
                          }
                          notAuthenticate={true}
                        />
                      </div>
                    );
                  })}
              </ReactGridLayout>
            </TransformComponent>
          </TransformWrapper>
        </div>
        {projectId && (
          <div id="timeline" className="time-line">
            <Timeline
              layoutBubble={layoutTimeline}
              layoutBubbleProps={layoutCustomPropsTimeline}
              bubbleProjectId={projectId}
              //onBubbleLoad={onBubbleLoad}
              notAuthenticate={true}
              setLoading={setLoading}
              setStartTimelinePeriodParam={setStartTimelinePeriod}
              bubbleBeingDeleted={bubbleBeingDeleted}
              onContentChanged={bubbleContentChanged}
              onColorChanged={bubbleColorChanged}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardWithOutAuthentication;
