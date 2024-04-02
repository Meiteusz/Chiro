import { useState, useEffect } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DropDrag = (props) => {
  const [layouts, setLayouts] = useState({
    lg: _.map(_.range(0, 4), function (item, i) {
      var y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (_.random(0, 5) * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 5,
        h: y,
        i: i.toString(),
        static: Math.random() < 0.05,
      };
    }),
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [mounted, setMounted] = useState(false);
  const [toolbox, setToolbox] = useState({
    lg: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox({
      ...toolbox,
      [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || [],
    });
  };

  const onLayoutChange = (layout, layouts) => {
    setLayouts({ ...layouts });
  };

  const onDrop = (layoutItem, _ev) => {
    const isNearExistingBlock = layouts.lg.some((existingLayout) => {
      return (
        Math.abs(existingLayout.x - layoutItem.x) <= 2 && // Defina a distância de proximidade adequada aqui
        Math.abs(existingLayout.y - layoutItem.y) <= 2 // Defina a distância de proximidade adequada aqui
      );
    });

    layoutItem.static = isNearExistingBlock;
  };

  const onDragStop = (newItem, _placeholder, _evt, _element) => {
    const isNearExistingBlock = layouts.lg.some((existingLayout) => {
      return (
        Math.abs(existingLayout.x - newItem.x) <= 2 && // Defina a distância de proximidade adequada aqui
        Math.abs(existingLayout.y - newItem.y) <= 2 // Defina a distância de proximidade adequada aqui
      );
    });

    newItem.static = isNearExistingBlock;

    setLayouts((prevLayouts) => {
      const updatedLayouts = { ...prevLayouts };
      const index = prevLayouts.lg.findIndex((item) => item.i === newItem.i);
      updatedLayouts.lg[index] = newItem;
      return updatedLayouts;
    });
  };
  const generateDOM = () => {
    return _.map(layouts.lg, function (l, i) {
      return (
        <div
          key={i}
          style={{ background: "green" }}
          className={l.static ? "static" : ""}
        ></div>
      );
    });
  };

  return (
    <>
      <div style={{ height: "100vh" }}>
        <ResponsiveReactGridLayout
          {...props}
          style={{ background: "#fff", height: "100%" }} // Define a altura do layout como 100%
          measureBeforeMount={false}
          useCSSTransforms={mounted}
          compactType={null}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          onDrop={onDrop}
          margin={[3, 3]} // Ajusta o espaçamento entre os componentes e as bordas do contêiner
          onDragStop={onDragStop} // Adicionamos esse evento para atualizar o estado apenas quando o arrasto for concluído
          isDroppable
        >
          {generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    </>
  );
};

export default DropDrag;

DropDrag.defaultProps = {
  className: "layout",
  rowHeight: 30,
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding: [0, 0],
};
