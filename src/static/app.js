var app = new Vue({
  el: '#app',
  data: function () {
    var defaultSides = 300
    var stats = Array.apply(null, { length: defaultSides })
      .map(function () { return 100 })

    return {
      message: "",
      player: "",
      url: "",
      stats: stats,
      points: generatePoints(stats),
      sides: defaultSides,
      minRadius: 75,
      interval: null,
      updateInterval: 1500,
      visible: false
    }
  },
  watch: {
    sides: function (newSides, oldSides) {
      var sidesDifference = newSides - oldSides
      if (sidesDifference > 0) {
        for (var i = 1; i <= sidesDifference; i++) {
          this.stats.push(this.newRandomValue())
        }
      } else {
        var absoluteSidesDifference = Math.abs(sidesDifference)
        for (var i = 1; i <= absoluteSidesDifference; i++) {
          this.stats.shift()
        }
      }
    },
    stats: function (newStats) {
      TweenLite.to(
        this.$data,
        this.updateInterval / 1000,
        { points: generatePoints(newStats) }
      )
    },
    updateInterval: function () {
      this.resetInterval()
    }
  },
  mounted: function () {
    this.resetInterval()
  },
  methods: {
    open() {
      this.message = "..."
      var l;
      var vm = this
      axios({
        method: 'get',
        url: '/api/v1/lottery',
      })
        .then(function (response) {
          l = response.data
          console.log(l);
          vm.message = l.message;
          vm.url = l.url;
          vm.player = l.player;
          vm.$notify.success({
            title: l.player,
            message: l.message,
            offset: 100,
            duration: 2000,
          });
        })
        .catch(function (error) {
          console.log(error);
        });


    },
    getLottery: function () {
      var l;
      axios({
        method: 'get',
        url: '/api/v1/lottery',
      })
        .then(function (response) {
          l = response.data
          console.log(l);
        })
        .catch(function (error) {
          console.log(error);
        });
      return l;
    },
    randomizeStats: function () {
      var vm = this
      this.stats = this.stats.map(function () {
        return vm.newRandomValue()
      })
    },
    newRandomValue: function () {
      return Math.ceil(this.minRadius + Math.random() * (100 - this.minRadius))
    },
    resetInterval: function () {
      var vm = this
      clearInterval(this.interval)
      this.randomizeStats()
      this.interval = setInterval(function () {
        vm.randomizeStats()
      }, this.updateInterval)
    }
  }
})

function valueToPoint(value, index, total) {
  var x = 0
  var y = -value * 0.9
  var angle = Math.PI * 2 / total * index
  var cos = Math.cos(angle)
  var sin = Math.sin(angle)
  var tx = x * cos - y * sin + 100
  var ty = x * sin + y * cos + 100
  return { x: tx, y: ty }
}

function generatePoints(stats) {
  var total = stats.length
  return stats.map(function (stat, index) {
    var point = valueToPoint(stat, index, total)
    return point.x + ',' + point.y
  }).join(' ')
}