import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { BubbleChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={BubbleChart({
        style: "toast",
        title: "Market Analysis",
        data: {
          datasets: [
            {
              legend: "Tech",
              data: [
                { x: 80, y: 90, value: 50, label: "Apple" },
                { x: 70, y: 85, value: 40, label: "Google" },
                { x: 60, y: 75, value: 35, label: "Meta" },
                { x: 85, y: 70, value: 30, label: "Microsoft" },
              ],
            },
            {
              legend: "Finance",
              data: [
                { x: 50, y: 60, value: 45, label: "JPMorgan" },
                { x: 55, y: 55, value: 38, label: "Goldman" },
                { x: 45, y: 65, value: 28, label: "Citi" },
              ],
            },
            {
              legend: "Healthcare",
              data: [
                { x: 40, y: 80, value: 42, label: "J&J" },
                { x: 35, y: 70, value: 33, label: "Pfizer" },
                { x: 30, y: 75, value: 25, label: "Merck" },
              ],
            },
          ],
        },
      })}
      width="800px"
      height="500px"
      renderer="svg"
    />
  );
}

function ToastRichData() {
  return (
    <Widget
      widget={BubbleChart({
        style: "toast",
        title: "Global Country Indicators: GDP vs Life Expectancy vs Population",
        data: {
          datasets: [
            {
              legend: "Asia",
              data: [
                { x: 11194, y: 76.1, value: 1412, label: "China" },
                { x: 2277, y: 70.4, value: 1408, label: "India" },
                { x: 40247, y: 84.8, value: 126, label: "Japan" },
                { x: 12720, y: 72.5, value: 274, label: "Indonesia" },
                { x: 34168, y: 83.7, value: 52, label: "South Korea" },
                { x: 59795, y: 83.6, value: 6, label: "Singapore" },
                { x: 3694, y: 72.0, value: 167, label: "Bangladesh" },
                { x: 6610, y: 71.6, value: 99, label: "Vietnam" },
                { x: 3572, y: 71.7, value: 116, label: "Philippines" },
                { x: 12664, y: 78.6, value: 70, label: "Thailand" },
              ],
            },
            {
              legend: "Europe",
              data: [
                { x: 46208, y: 80.9, value: 83, label: "Germany" },
                { x: 40964, y: 82.3, value: 67, label: "France" },
                { x: 46344, y: 80.4, value: 67, label: "UK" },
                { x: 34158, y: 83.5, value: 59, label: "Italy" },
                { x: 29350, y: 83.5, value: 47, label: "Spain" },
                { x: 57218, y: 82.4, value: 17, label: "Netherlands" },
                { x: 55493, y: 82.0, value: 9, label: "Switzerland" },
                { x: 52131, y: 81.6, value: 10, label: "Sweden" },
                { x: 17650, y: 78.7, value: 38, label: "Poland" },
                { x: 69432, y: 82.5, value: 6, label: "Norway" },
              ],
            },
            {
              legend: "Americas",
              data: [
                { x: 63544, y: 77.3, value: 332, label: "USA" },
                { x: 43242, y: 82.3, value: 38, label: "Canada" },
                { x: 8347, y: 75.1, value: 213, label: "Brazil" },
                { x: 10046, y: 75.1, value: 129, label: "Mexico" },
                { x: 6126, y: 77.3, value: 51, label: "Colombia" },
                { x: 12794, y: 80.2, value: 19, label: "Chile" },
                { x: 10636, y: 76.5, value: 45, label: "Argentina" },
                { x: 6127, y: 76.8, value: 33, label: "Peru" },
              ],
            },
            {
              legend: "Africa",
              data: [
                { x: 6001, y: 64.3, value: 206, label: "Nigeria" },
                { x: 7055, y: 64.1, value: 60, label: "South Africa" },
                { x: 3699, y: 67.1, value: 104, label: "Egypt" },
                { x: 1084, y: 63.7, value: 115, label: "Ethiopia" },
                { x: 2006, y: 62.8, value: 54, label: "Kenya" },
                { x: 3040, y: 73.4, value: 37, label: "Morocco" },
                { x: 3699, y: 66.7, value: 44, label: "Algeria" },
                { x: 2384, y: 58.1, value: 43, label: "Tanzania" },
                { x: 3568, y: 59.3, value: 33, label: "Ghana" },
              ],
            },
            {
              legend: "Oceania",
              data: [
                { x: 51812, y: 83.4, value: 26, label: "Australia" },
                { x: 41127, y: 82.3, value: 5, label: "New Zealand" },
                { x: 2280, y: 68.4, value: 9, label: "Papua New Guinea" },
                { x: 5057, y: 67.4, value: 1, label: "Fiji" },
                { x: 4932, y: 73.8, value: 1, label: "Samoa" },
                { x: 6137, y: 66.9, value: 1, label: "Tonga" },
                { x: 3442, y: 68.1, value: 1, label: "Vanuatu" },
                { x: 1608, y: 64.5, value: 1, label: "Solomon Islands" },
              ],
            },
          ],
        },
      })}
      width="900px"
      height="600px"
      renderer="svg"
    />
  );
}

const meta: Meta = {
  title: "BubbleChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDefault />,
};

export const RichData: Story = {
  render: () => <ToastRichData />,
};
