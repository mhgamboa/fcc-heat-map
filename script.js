const h = 410;
const w = 1250;
const padding = 60;
const tooltip = d3.select("#tooltip");

const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then((data) => {
    monthsData = data.monthlyVariance;
    let baseTemp = data.baseTemperature;
    console.log(d3.min(monthsData, (d) => d.variance));

    const parseMonth = d3.timeParse("%m"); //Converts numbers into months

    const yScale = d3
      .scaleTime()
      .domain([parseMonth(12), parseMonth(1)])
      .range([h - padding, padding]);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    svg
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis");

    /* Creat X Axis */
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(monthsData, (d) => d.year),
        d3.max(monthsData, (d) => d.year),
      ])
      .range([padding, w - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${h - padding})`)
      .attr("id", "x-axis");

    /* Colors Data */
    const colors = [
      "#5E4FA2",
      "#3288BD",
      "#66C2A5",
      "#E6F598",
      "#FFFFBF",
      "#FEE08B",
      "#FDAE61",
      "#F46D43",
      "#9E0142",
    ];
    let fillColors = d3
      .scaleQuantize()
      .domain([
        d3.min(monthsData, (d) => d.variance),
        d3.max(monthsData, (d) => d.variance),
      ])
      .range(colors);
    /* Append Data */
    svg
      .selectAll("rect")
      .data(monthsData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("fill", (d) => fillColors(d.variance))
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => baseTemp + d.variance)
      .attr("width", (w / monthsData.length) * 10)
      .attr("height", (h - padding) / 12 - 3)
      .attr("y", (d) => yScale(parseMonth(d.month - 1)))
      .attr("x", (d) => xScale(d.year))
      // Add ToolTips when hovering
      .on("mouseover", (e, d) => {
        tooltip
          .attr("data-year", d.year)
          .style("visibility", "visible")
          .style("left", e.pageX - 25 + "px")
          .style("top", e.pageY - 90 + "px")
          .html(
            `${d.year} - ${d.month}<br>${8.66 + d.variance}℃<br>${d.variance}`
          );
      })
      .on("mousemove", (e, d) => {
        tooltip
          .attr("data-year", d.year)
          .style("visibility", "visible")
          .style("left", e.pageX - 25 + "px")
          .style("top", e.pageY - 90 + "px")
          .html(
            `${d.year} - ${d.month}<br>${8.66 + d.variance}℃<br>${d.variance}`
          );
      })
      .on("mouseout", (e, d) => {
        tooltip.transition().style("visibility", "hidden");
      });

    /* Create Legend and Add items to legend */
    const legend = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", 100)
      .attr("id", "legend");

    legend
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("height", 50)
      .attr("width", 50)
      .attr("fill", (d) => d)
      .attr("x", (d, i) => i * (w / colors.length) + 45)
      .attr("y", "25")
      .append("title")
      .text((d, i) => `>${2.8 + i * 1.1}℃`);
  });
