<script>
import Loader from "./loader";

/**
 * Email-sent component
 */
export default {
  components: {
    Loader,
  },
  data() {
    return {
      isActive: "year",
      series: [
        {
          name: "Series A",
          data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
        },
        {
          name: "Series B",
          data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
        },
        {
          name: "Series C",
          data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
        },
      ],
      chartOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "15%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        colors: ["#556ee6", "#f1b44c", "#34c38f"],
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
    };
  },
  props: {
    updating: {
      type: Boolean,
    },
  },
  methods: {
    changeVal(value) {
      switch (value) {
        case "month":
          this.isActive = "month";
          this.series = [
            {
              name: "Series A",
              data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
            },
            {
              name: "Series B",
              data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
            },
            {
              name: "Series C",
              data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
            },
          ];
          break;
        case "week":
          this.isActive = "week";
          this.series = [
            {
              name: "Series A",
              data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
            },
            {
              name: "Series B",
              data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
            },
            {
              name: "Series C",
              data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
            },
          ];
          break;
        case "year":
          this.isActive = "year";
          this.series = [
            {
              name: "Series A",
              data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
            },
            {
              name: "Series B",
              data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
            },
            {
              name: "Series C",
              data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
            },
          ];
          break;
        default:
          this.series = [
            {
              name: "Series A",
              data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48],
            },
            {
              name: "Series B",
              data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
            },
            {
              name: "Series C",
              data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18],
            },
          ];
          break;
      }
    },
  },
};
</script>
<template>
  <Loader :loading="updating">
    <BCard no-body>
      <BCardBody>
        <div class="d-sm-flex flex-wrap">
          <BCardTitle class="mb-4">Email Sent</BCardTitle>
          <div class="ms-auto">
            <ul class="nav nav-pills">
              <li class="nav-item">
                <BLink class="nav-link" href="javascript: void(0);" @click="changeVal('week')"
                  :class="{ 'active': isActive == 'week' }">Week</BLink>
              </li>
              <li class="nav-item">
                <BLink class="nav-link" href="javascript: void(0);" @click="changeVal('month')"
                  :class="{ 'active': isActive == 'month' }">Month</BLink>
              </li>
              <li class="nav-item">
                <BLink class="nav-link" href="javascript: void(0);" @click="changeVal('year')"
                  :class="{ 'active': isActive == 'year' }">Year</BLink>
              </li>
            </ul>
          </div>
        </div>

        <apexchart class="apex-charts" type="bar" dir="ltr" height="360" :series="series" :options="chartOptions">
        </apexchart>
      </BCardBody>
    </BCard>
  </Loader>
</template>
