import { quantityYears } from "../../components/timeline/params";

const mouthsPTBR = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const renderDays = (widthDays,events, ref) => {
  const allDays = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthDays = [];
      for (let day = 1; day <= daysInMonth; day++) {
        monthDays.push(
          <div
            key={`${year}-${month}-${day}`}
            style={{
              //border: "1px solid gray",
              borderRadius: "5px",
              width: `${widthDays}px`,
              height: "35px",
              textAlign: "center",
              display: "inline-block",
              backgroundColor: "rgba(168, 168, 168, 0.7)",
              padding: "5px",
            }}
          >
            {day}
          </div>
        );
      }
      allDays.push(
        <div key={`${year}-${month}`} style={{ flex: "0 0 auto" }}>
          <div>
            <div
              style={{
                fontWeight: "600",
                textAlign: "center",
                backgroundColor: "#303030",
                padding: "3px",
                borderRight: "1px solid white",
              }}
            >
              <label
                style={{
                  color: "#F0F0F0",
                  marginBottom: "5px",
                }}
              >
                {`${mouthsPTBR[month]} | ${year}`}
              </label>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontWeight: "600",
              }}
            >
              {monthDays}
            </div>
          </div>
        </div>
      );
    }
  }
  return (
    <div
      {...events}
      ref={ref}
      style={{
        display: "flex",
        overflowX: "hidden",
      }}
    >
      {allDays}
    </div>
  );
};

const renderMonths = (widthMonths, events, ref) => {
  const allMonths = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    allMonths.push(
      <div key={year} style={{ display: "inline-block" }}>
        <div>
          <div
            style={{
              fontWeight: "600",
              textAlign: "center",
              backgroundColor: "#303030",
              padding: "3px",
            }}
          >
            <label style={{ color: "#F0F0F0", marginBottom: "5px" }}>
              {year}
            </label>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
            }}
          >
            {Array.from({ length: 12 }, (_, month) => (
              <div
                key={`${year}-${month}`}
                style={{
                  backgroundColor: "rgba(168, 168, 168, 0.7)",
                  fontWeight: "600",
                  borderRadius: "5px",
                  width: `${widthMonths}px`,
                  height: "40px",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {`${mouthsPTBR[month]}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      {...events}
      ref={ref}
      style={{
        overflowX: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {allMonths}
    </div>
  );
};

const renderYears = (widthYears, events, ref) => {
  const allYears = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year < currentYear + quantityYears; year++) {
    allYears.push(
      <div
        key={year}
        style={{
          marginTop: "5px",
          width: `${widthYears}px`,
          textAlign: "center",
          display: "inline-block",
          fontWeight: "600",
          backgroundColor: "#303030",
          padding: "3px",
        }}
      >
        <label style={{ color: "#F0F0F0", marginBottom: "5px" }}>
          {year}
        </label>
      </div>
    );
  }
  return (
    <div
      {...events}
      ref={ref}
      style={{
        overflowX: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {allYears}
    </div>
  );
};

export {renderDays, renderMonths, renderYears};