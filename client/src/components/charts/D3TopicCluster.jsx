import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { fetchTopics } from '../../services/api';

export default function D3TopicCluster({ filters }) {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const containerRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTopics(filters).then(setData).catch(console.error);
  }, [filters]);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth || 600;
    const H = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);

    const maxCount = d3.max(data, d => d.count) || 1;
    const radiusScale = d3.scaleSqrt().domain([0, maxCount]).range([14, 60]);
    const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, data.length]);

    // Bubble data
    const nodes = data.slice(0, 30).map((d, i) => ({
      ...d,
      r: radiusScale(d.count),
      color: colorScale(i),
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(d => d.r + 3).iterations(3))
      .force('x', d3.forceX(W / 2).strength(0.04))
      .force('y', d3.forceY(H / 2).strength(0.04))
      .alphaDecay(0.03);

    const tooltip = d3.select(tooltipRef.current);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end',   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Circle
    node.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.18)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('cursor', 'grab')
      .on('mouseover', (e, d) => {
        d3.select(e.currentTarget).attr('fill-opacity', 0.4).attr('stroke-width', 2.5);
        tooltip
          .style('opacity', 1)
          .html(`<strong style="color:${d.color}">${d.topic}</strong><br/>Count: ${d.count}<br/>Avg Intensity: ${d.avgIntensity}`);
      })
      .on('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        tooltip
          .style('left', `${e.clientX - rect.left + 12}px`)
          .style('top', `${e.clientY - rect.top - 40}px`);
      })
      .on('mouseout', (e) => {
        d3.select(e.currentTarget).attr('fill-opacity', 0.18).attr('stroke-width', 1.5);
        tooltip.style('opacity', 0);
      });

    // Text label
    node.append('text')
      .text(d => d.r > 22 ? (d.topic.length > 10 ? d.topic.substring(0,10)+'…' : d.topic) : '')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', d => Math.max(9, Math.min(13, d.r / 3.5)))
      .attr('fill', 'var(--text-primary)')
      .attr('pointer-events', 'none');

    simulation.on('tick', () => {
      node.attr('transform', d => `translate(${
        Math.max(d.r, Math.min(W - d.r, d.x))
      },${Math.max(d.r, Math.min(H - d.r, d.y))})`);
    });

    return () => simulation.stop();
  }, [data]);

  return (
    <div ref={containerRef} className="d3-container" style={{ position: 'relative', minHeight: 400 }}>
      <svg ref={svgRef} style={{ width: '100%', height: 400 }} />
      <div ref={tooltipRef} className="d3-tooltip" style={{ color: 'var(--text-primary)' }} />
      {data.length === 0 && <div className="loading-spinner" />}
    </div>
  );
}
