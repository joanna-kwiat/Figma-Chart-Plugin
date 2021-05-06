figma.showUI(__html__)

figma.ui.onmessage = async (numbers) => {
  
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
//funkcja potrzebna do zmiany kolorów elementów
  function clone(val) {
    const type = typeof val
    if (val === null) {
      return null
    } else if (type === 'undefined' || type === 'number' ||
              type === 'string' || type === 'boolean') {
      return val
    } else if (type === 'object') {
      if (val instanceof Array) {
        return val.map(x => clone(x))
      } else if (val instanceof Uint8Array) {
        return new Uint8Array(val)
      } else {
        let o = {}
        for (const key in val) {
          o[key] = clone(val[key])
        }
        return o
      }
    }
    throw 'unknown'
  }

//////////////////////////////////////////////////////////////////
//PIE CHART
//////////////////////////////////////////////////////////////////
  if (numbers.type === 'pie'){
    const width = 150
    const height = 150
    const widthPlus = 100

    const frame = figma.createFrame()
    figma.currentPage.appendChild(frame)
    frame.resizeWithoutConstraints(width + widthPlus, height)

    let numbers2 = (numbers.numbers).map(x => Math.max(0, x)) //redukuje liczby ujemne
    const total = numbers2.reduce((a, b) => a + b, 0)//sumuje elementy w tablicy
    let start = 0;

    //tworzenie elementów grafu kołowego
    for (const num of numbers2) {
      const c = Math.sqrt(start / total)
      const ellipse = figma.createEllipse()
      frame.appendChild(ellipse)
      ellipse.resizeWithoutConstraints(width, height)
      ellipse.fills = [{ type: 'SOLID', color: {r: c, g: c, b: c} }]
      ellipse.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}
      ellipse.x = widthPlus;
      ellipse.arcData = {
        startingAngle: (start / total - 0.25) * 2 * Math.PI,
        endingAngle: ((start + num) / total - 0.25) * 2 * Math.PI,
        innerRadius: 0,
      }
      start += num
    }

    //kolorowanie wykresu
    const ellipse_ColorBurn = figma.createEllipse()
    frame.appendChild(ellipse_ColorBurn)
    ellipse_ColorBurn.resizeWithoutConstraints(width, height)
    const fills = clone(ellipse_ColorBurn.fills)
    fills[0].color.r = 0.28
    fills[0].color.g = 0.30
    fills[0].color.b = 0.82
    ellipse_ColorBurn.fills = fills
    ellipse_ColorBurn.x = widthPlus;
    ellipse_ColorBurn.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}
    ellipse_ColorBurn.blendMode = "OVERLAY"

    let start2 = 0
    let heightVal = height
    //legenda
    for (const num of numbers2) {
      const c = Math.sqrt(start2 / total)
      const posY = heightVal-20*num
      const ellipseLabel = figma.createEllipse()
      frame.appendChild(ellipseLabel)
      ellipseLabel.resizeWithoutConstraints(15, 15)
      ellipseLabel.fills = [{ type: 'SOLID', color: {r: c, g: c, b: c} }]
      ellipseLabel.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}
      ellipseLabel.x = widthPlus/2
      ellipseLabel.y = posY

      const ellipse_ColorBurn2 = figma.createEllipse()
      frame.appendChild(ellipse_ColorBurn2)
      ellipse_ColorBurn2.resizeWithoutConstraints(15, 15)
      const fills = clone(ellipse_ColorBurn2.fills)
      fills[0].color.r = 0.28
      fills[0].color.g = 0.30
      fills[0].color.b = 0.82
      ellipse_ColorBurn2.fills = fills
      ellipse_ColorBurn2.x = widthPlus/2
      ellipse_ColorBurn2.y = posY
      ellipse_ColorBurn2.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}
      ellipse_ColorBurn2.blendMode = "OVERLAY"

      const label = figma.createText()
      frame.appendChild(label)
      label.x = 5
      label.y = posY-5
      label.resizeWithoutConstraints(40, 20)
      label.fills = [{ type: 'SOLID', color: {r: 0, g: 0, b: 0} }]
      label.characters = (num/total*100).toFixed(1)+"%"
      label.fontSize = 12
      label.textAlignHorizontal = 'CENTER'
      label.textAlignVertical = 'BOTTOM'
      label.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}

      start2 += num
    }

    figma.closePlugin()
  }

//////////////////////////////////////////////////////////////////
//BAR CHART
//////////////////////////////////////////////////////////////////

  if (numbers.type === 'bar'){
    const width = 310
    const height = 200
    const chartX = 100
    const chartY = 55
    const chartWidth = 210
    const chartHeight = 120

    const frame = figma.createFrame()
    figma.currentPage.appendChild(frame)
    frame.resizeWithoutConstraints(width, height)

    let numbers2 = (numbers.numbers).map(x => Math.max(0, x)) //redukuje liczby ujemne

    const min = numbers2.reduce((a, b) => Math.min(a, b), 0)
    const max = numbers2.reduce((a, b) => Math.max(a, b), 0)

    for (let i = 0; i < numbers2.length; i++) {
      const num = numbers2[i];
      const left = chartX + chartWidth * (i + 0.25) / numbers2.length;
      const right = chartX + chartWidth * (i + 0.75) / numbers2.length;
      const top = chartY + chartHeight - chartHeight * (Math.max(0, num) - min) / (max - min);
      const bottom = chartY + chartHeight - chartHeight * (Math.min(0, num) - min) / (max - min);

      // The column
      const column = figma.createRectangle()
      frame.appendChild(column)
      column.x = left
      column.y = top
      column.resizeWithoutConstraints(25, bottom - top)
      column.fills = [{ type: 'SOLID', color: {r: 0.28, g: 0.3, b: 0.83} }]
      column.opacity = 0.4
      column.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}

      //dni tygodnia
      var weekDay = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];
      const label = figma.createText()
      frame.appendChild(label)
      label.x = left
      label.y = height - 15 
      label.resizeWithoutConstraints(25, 15)
      label.fills = [{ type: 'SOLID', color: {r: 0, g: 0, b: 0} }]
      label.characters = weekDay[i]
      label.fontSize = 12
      label.textAlignHorizontal = 'CENTER'
      label.textAlignVertical = 'BOTTOM'
      label.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}

      //podpis wartości
      const labelUp = figma.createText()
      frame.appendChild(labelUp)
      labelUp.x = left
      labelUp.y = top - 15
      labelUp.resizeWithoutConstraints(25, 15)
      labelUp.fills = [{ type: 'SOLID', color: {r: 0.8, g: 0.8, b: 0.8} }]
      labelUp.characters = num.toString()
      labelUp.fontSize = 12
      labelUp.textAlignHorizontal = 'CENTER'
      labelUp.textAlignVertical = 'BOTTOM'
      labelUp.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}
    }
    
    figma.closePlugin()
  }

//////////////////////////////////////////////////////////////////
//CIRCLE PERCENT CHART
//////////////////////////////////////////////////////////////////

  if (numbers.type === 'circle'){
    const width = 95
    const height = 95

    const frame = figma.createFrame()
    figma.currentPage.appendChild(frame)
    frame.resizeWithoutConstraints(width, height)

    let numbers3 = (numbers.numbers).map(x => Math.max(0, x))//redukuje liczby ujemne, przerabia na procenty
    let numbers2 = numbers3.map(x => +x/100) 
    const total = numbers2.reduce((a, b) => a + b, 0)//sumuje elementy w tablicy
    const supp = 1 - total
    let start = 0
    let itt = 0

    let colorList: Array<number> = [0.93, 0.27, 0.31,/**/0.96, 0.64, 0.65,/**/0.36, 0.04, 0.05,/**/ 0.73, 0.06, 0.11,/**/0.96, 0.64, 0.65]; //R,G,B, R,G,B...

    const arc = figma.createEllipse()
    frame.appendChild(arc)
    arc.resizeWithoutConstraints(width, height)
    arc.arcData = {startingAngle: 0, endingAngle: 2* Math.PI, innerRadius: 0.81}

    //tworzenie elementów grafu kołowego
    for (const num of numbers2) {
      const c = Math.sqrt(start / total)
      const ellipse = figma.createEllipse()
      frame.appendChild(ellipse)
      ellipse.resizeWithoutConstraints(width, height)
      ellipse.fills = [{ type: 'SOLID', color: {r: colorList[3*itt], g: colorList[3*itt+1], b: colorList[3*itt+2]} }]
      ellipse.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}
      ellipse.arcData = {
        startingAngle: (start / 1 - 0.25) * 2 * Math.PI,
        endingAngle: ((start + num) / 1 - 0.25) * 2 * Math.PI,
        innerRadius: 0.81,
      }
      start += num
      itt += 1
    }
    let numbers4 = numbers3.toString()
    numbers4 = numbers4.replace(/,/gi, "%\n")
    numbers4 = numbers4 + "%"

      const label = figma.createText()
      frame.appendChild(label)
      label.resizeWithoutConstraints(95, 95)
      label.fills = [{ type: 'SOLID', color: {r: 0, g: 0, b: 0} }]
      label.characters = numbers4
      if(numbers2.length==4){
        label.fontSize = 12
      }
      if(numbers2.length==3){
        label.fontSize = 15
      }
      if(numbers2.length<=2){
        label.fontSize = 20
      }
      label.textAlignHorizontal = 'CENTER'
      label.textAlignVertical = 'CENTER'
      label.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'}

    figma.closePlugin()
  }
 
}
