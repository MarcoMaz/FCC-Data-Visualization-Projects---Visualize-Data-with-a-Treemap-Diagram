function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this)
    var words = text.text().split(/\s+/).reverse()
    var word
    var line = []
    var lineNumber = 0
    var lineHeight = 1.1
    var x = text.attr("x")
    var y = text.attr("y")
    var dy = 0

    var tspan = text.text(null).append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em")

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word)
      }
    }
  });
}

//Declare VARIABLES
const w = 1400
const h = 800
const link = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'

//Declare SVG
const svg = d3.select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h)

d3.json(link).then(function (data) {

  // Define the Treemap
  const root = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value)
  d3.treemap().size([w, h - 200]).paddingTop(30).paddingInner(1)(root)

  // Scales
  const color = d3.scaleOrdinal()
    .domain(['Action', 'Adventure', 'Comedy', 'Drama', 'Animation', 'Family', 'Biography'])
    .range(["#4C92C3", "#BED2ED", "#FF993E", '#FFC993', '#56B356', '#ADE5A1', '#DE5253'])

  const opacity = d3.scaleLinear().domain([10, 30]).range([0, 1])

  //Define the Legend
  const legendX = 500
  const legendY = 650

  const legendSquares = svg.attr('id', 'legend')
    .selectAll('rect')
    .data(color.range())
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', d => legendX - 30)
    .attr('y', (d, i) => 20 * i + legendY - 14)
    .attr('height', '15px')
    .attr('width', '15px')
    .style('fill', d => d)

  const legendText = svg.selectAll('text')
    .data(color.domain())
    .enter()
    .append('text')
    .attr("x", d => legendX)
    .attr("y", (d, i) => 20 * i + legendY)
    .attr("fill", "#000")
    .text(d => d)

  //Declare Title and Subtitles
  var title = svg.append("text")
    .attr('id', 'title')
    .attr('x', w / 2)
    .attr('y', 20)
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .text("Movie Sales")

  var title = svg.append("text")
    .attr('id', 'description')
    .attr('x', w / 2)
    .attr('y', 35)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Top 100 Highest Grossing Movies Grouped By Genre")

  //Declare the Leaves
  const leaves = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('class', 'tile')
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style("fill", d => color(d.parent.data.name))
    .style('opacity', d => opacity(d.data.value))
    .on("mouseover", function (d) {
      return tooltip
        .style("visibility", "visible")
        .html('Name: ' + d.data.name + '<br/>' + 'Category: ' + d.data.category + '<br/>' + 'Value: ' + d.data.value)
        .attr('data-value', d.data.value) })
    .on("mousemove", function () {
      return tooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px") })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden") })

  const textLeaves = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("class", "node")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0 + 10)
    .text(d => d.data.name)
    .attr("font-size", "9px")
    .attr("fill", "black")
    .style('border', '1px solid black')
    .call(wrap, 60)

  //Declare a Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr('id', 'tooltip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style('background-color', "lightyellow")
    .style('padding', '5px 10px')
    .style('font-size', '14px')
})