<script>
import Loader from "./loader";

/**
 * Monthly-Earning component
 */
export default {
  components: {
    Loader,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: 200,
          type: "radialBar",
          offsetY: -10,
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              name: {
                fontSize: "13px",
                color: undefined,
                offsetY: 60,
              },
              value: {
                offsetY: 22,
                fontSize: "16px",
                color: undefined,
                formatter: function (val) {
                  return val + "%";
                },
              },
            },
          },
        },
        colors: ["#556ee6"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91],
          },
        },
        stroke: {
          dashArray: 4,
        },
        labels: ["Series A"],
      },
      series: [67],
    };
  },
  props: {
    updating: {
      type: Boolean,
    },
  },
};
</script>

<template>
  <Loader :loading="updating">
    <BCard no-body>
      <BCardBody>
        <BCardTitle class="mb-4">Monthly Earning</BCardTitle>
        <BRow>
          <BCol sm="6">
            <p class="text-muted">This month</p>
            <h3>$34,252</h3>
            <p class="text-muted">
              <span class="text-success me-2">
                12%
                <i class="mdi mdi-arrow-up"></i>
              </span>
              From previous period
            </p>

            <div class="mt-4">
              <BLink href="javascript: void(0);" class="btn btn-primary btn-sm">
                View More
                <i class="mdi mdi-arrow-right ms-1"></i>
              </BLink>
            </div>
          </BCol>
          <BCol sm="6">
            <apexchart class="apex-charts" type="radialBar" height="200" dir="ltr" :series="series"
              :options="chartOptions"></apexchart>
          </BCol>
        </BRow>
        <p class="text-muted mb-0">
          We craft digital, graphic and dimensional thinking.
        </p>
      </BCardBody>
    </BCard>
  </Loader>
</template>