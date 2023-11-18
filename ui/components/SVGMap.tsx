import * as React from "react";
import WorldMap from "react-svg-worldmap";

const SVGmap = () => {
  const data = [
    { country: "cn", value: 10 }, // china
    { country: "in", value: 10 }, // india
    // { country: "us", value: 10 }, // united states
    // { country: "id", value: 10 }, // indonesia
    // { country: "pk", value: 10 }, // pakistan
    // { country: "br", value: 10 }, // brazil
    // { country: "ng", value: 10 }, // nigeria
    // { country: "bd", value: 10 }, // bangladesh
    // { country: "ru", value: 10 }, // russia
    // { country: "mx", value: 10 }, // mexico
  ];

  return (
    <div style={{ width: "100%", height: "100%" }} className="mx-auto">
      <WorldMap
        color="brown"
        title="The Last Lands"
        value-suffix="people"
        size="xxl"
        // size="responsive"
        data={data}
        backgroundColor="lightblue"
      />
    </div>
  );
};

export default SVGmap;
