// src/components/WorldMap.jsx
import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_data_countries2 from "@amcharts/amcharts5-geodata/data/countries2";

const WorldMapComponent = () => {
    const chartDiv = useRef(null);
    
    useLayoutEffect(() => {
        const root = am5.Root.new(chartDiv.current);
        root.setThemes([am5themes_Animated.new(root)]);
    
    // Create the main MapChart
    const chart = root.container.children.push(
        am5map.MapChart.new(root, 
            {
                projection: am5map.geoOrthographic(), //Global-style projection
                panX: "rotateX", //horizontal rotation
                panY: "rotateY", //vertical rotation
                wheelable: true, //zoom with mouse wheel
                background: am5.Rectangle.new(
                    root, 
                    {
                        fill: am5.color(0x000000), //space outside globe = black
                        fillOpacity: 1,
                    }
                ),
            })
    );
    
    
    // Background ocean series
    const backgroundSeries = am5map.MapPolygonSeries.new(root, {});
    backgroundSeries.data.setAll([
        //rectangle that covers the entire globe
        { geometry: am5map.getGeoRectangle(90, 180, -90, -180) },
    ]);

    backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color(0x0b6fbf), // ocean color
        stroke: am5.color(0x0b6fbf), // stroke color matches ocean
    });
    chart.series.unshift(backgroundSeries); // put ocean in the back

    
    // Land
    const landSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"], //exclude Antarctica
    })
    );

    landSeries.mapPolygons.template.setAll({
        fill: am5.color(0x7fb77e), // land color
        stroke: am5.color(0xffffff), // land borders
        strokeWidth: 0.5,
        tooltipText: "{name}", // show country name on hover
        interactive: true,
    });

    // Add hover state for land polygons
    landSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(0x9ece9f),
    });

    

    return () => root.dispose();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#000000", // matches space outside globe
        overflow: "hidden",
      }}
    >
      <div
        ref={chartDiv}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default WorldMapComponent;
