<template>
  <div
    class="el-progress"
    :class="[
      'el-progress--' + type,
      status ? 'is-' + status : '',
      {
        'el-progress--without-text': !showText,
        'el-progress--text-inside': textInside,
      }
    ]"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      v-if="type === 'line'"
      class="el-progress-bar"
    >
      <div
        class="el-progress-bar__outer"
        :style="{height: strokeWidth + 'px'}"
      >
        <div
          class="el-progress-bar__inner"
          :style="barStyle"
        >
          <div
            v-if="showText && textInside"
            class="el-progress-bar__innerText"
          >{{ percentage }}%</div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="el-progress-circle"
      :style="{height: width + 'px', width: width + 'px'}"
    >
      <svg viewBox="0 0 100 100">
        <path
          class="el-progress-circle__track"
          :d="trackPath"
          stroke="#e5e9f2"
          :stroke-width="relativeStrokeWidth"
          fill="none"
        />
        <path
          class="el-progress-circle__path"
          :d="trackPath"
          stroke-linecap="round"
          :stroke="stroke"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="circlePathStyle"
        />
      </svg>
    </div>
    <div
      v-if="showText && !textInside"
      class="el-progress__text"
      :style="{fontSize: progressTextSize + 'px',color: this.color}"
    >
      <template v-if="!status">{{ ptext }}台</template>
      <template v-else>
        <slot v-if="status === 'text'" />
        <i
          v-else
          :class="iconClass"
        />
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ElxProgress',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: val => ['line', 'circle'].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    status: {
      type: String,
      validator: val => ['text', 'success', 'exception'].indexOf(val) > -1
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: ''
    },
    ptext: {
      type: String,
      default: '0'
    }
  },
  computed: {
    barStyle() {
      const style = {}
      style.width = this.percentage + '%'
      style.backgroundColor = this.color
      return style
    },
    relativeStrokeWidth() {
      return ((this.strokeWidth / this.width) * 100).toFixed(1)
    },
    trackPath() {
      const radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)

      return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius *
        2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`
    },
    perimeter() {
      const radius = 50 - parseFloat(this.relativeStrokeWidth) / 2
      return 2 * Math.PI * radius
    },
    circlePathStyle() {
      const perimeter = this.perimeter
      return {
        strokeDasharray: `${perimeter}px,${perimeter}px`,
        strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
        transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    stroke() {
      let ret
      if (this.color) {
        ret = this.color
      } else {
        switch (this.status) {
          case 'success':
            ret = '#13ce66'
            break
          case 'exception':
            ret = '#ff4949'
            break
          default:
            ret = '#20a0ff'
        }
      }
      return ret
    },
    iconClass() {
      if (this.type === 'line') {
        return this.status === 'success'
          ? 'el-icon-circle-check'
          : 'el-icon-circle-close'
      } else {
        return this.status === 'success' ? 'el-icon-check' : 'el-icon-close'
      }
    },
    progressTextSize() {
      return this.type === 'line'
        ? 12 + this.strokeWidth * 0.4
        : this.width * 0.111111 + 2
    }
  }
}
</script>
