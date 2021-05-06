figma.showUI(__html__)

//////////////////////////////////////////////////////////////////
//PIE CHART
//////////////////////////////////////////////////////////////////
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

  const width = 150
  const height = 150
  const widthPlus = 100

  const frame = figma.createFrame()
  figma.currentPage.appendChild(frame)
  frame.resizeWithoutConstraints(width + widthPlus, height)

  numbers = numbers.map(x => Math.max(0, x)) //redukuje liczby ujemne
  const total = numbers.reduce((a, b) => a + b, 0)//sumuje elementy w tablicy
  let start = 0;

  //tworzenie elementów grafu kołowego
  for (const num of numbers) {
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
  for (const num of numbers) {
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

///////////////////////////////////////////////////////////////
//BARCHART
///////////////////////////////////////////////////////////////
