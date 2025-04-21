  export const calTime = (distance:number) => {
    const distanceKm = distance / 1000
    const averageSpeedKmH = 40

    const timeHours = distanceKm / averageSpeedKmH
    const hours = Math.floor(timeHours)
    const minutes = Math.round((timeHours - hours) * 60)

    if (hours === 0 && minutes === 0) {
      return 'ít hơn 1 phút'
    } else if (hours === 0) {
      return `${minutes} phút`
    } else if (minutes === 0) {
      return `${hours} giờ`
    } else {
      return `${hours} giờ ${minutes} phút`
    }
  }