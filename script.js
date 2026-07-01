const svg = d3.select("#map");
const tooltip = d3.select("#tooltip");

// Internal drawing size
const width = 960;
const height = 600; 

// Make the SVG responsive
svg
  .attr("viewBox", `0 0 ${width} ${height}`)
  //.attr("preserveAspectRatio", "xMidYMid meet")
  //.attr("width", "100%")
  //.attr("height", "100%");

const projection = d3.geoAlbersUsa();
const path = d3.geoPath().projection(projection);

// Load US map
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
  .then(us => {

    const states = topojson.feature(us, us.objects.states).features;

    // Automatically size and center the map
    projection.fitSize(
      [width, height],
      {
        type: "FeatureCollection",
        features: states
      }
    );

    svg.selectAll("path")
      .data(states)
      .enter()
      .append("path")
      .attr("class", d => {
        const abbr = getStateAbbr(d.id);
        return stateData[abbr] ? "state active" : "state inactive";
      })
      .attr("d", path)
      .on("mouseover", function (event, d) {

        const abbr = getStateAbbr(d.id);
        const state = stateData[abbr];

        if (!state) return;

        d3.select(this).style("opacity", 0.85);

        tooltip
          .classed("hidden", false)
          .html(`
            <strong>${state.name}</strong><br>
            ${state.communities.map(c => `• ${c}`).join("<br>")}
          `);
      })
      .on("mousemove", function (event) {

        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);

      })
      .on("mouseout", function () {

        d3.select(this).style("opacity", 1);

        tooltip.classed("hidden", true);

      });

  })
  .catch(err => console.error(err));

// -------------------------------------
// FIPS → State Abbreviation
// -------------------------------------

function getStateAbbr(id) {

  const map = {
    1:"AL",
    2:"AK",
    4:"AZ",
    5:"AR",
    6:"CA",
    8:"CO",
    9:"CT",
    10:"DE",
    11:"DC",
    12:"FL",
    13:"GA",
    15:"HI",
    16:"ID",
    17:"IL",
    18:"IN",
    19:"IA",
    20:"KS",
    21:"KY",
    22:"LA",
    23:"ME",
    24:"MD",
    25:"MA",
    26:"MI",
    27:"MN",
    28:"MS",
    29:"MO",
    30:"MT",
    31:"NE",
    32:"NV",
    33:"NH",
    34:"NJ",
    35:"NM",
    36:"NY",
    37:"NC",
    38:"ND",
    39:"OH",
    40:"OK",
    41:"OR",
    42:"PA",
    44:"RI",
    45:"SC",
    46:"SD",
    47:"TN",
    48:"TX",
    49:"UT",
    50:"VT",
    51:"VA",
    53:"WA",
    54:"WV",
    55:"WI",
    56:"WY"
  };

  return map[id];
}