var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, {
    height: 450,
    width: 650
});
figma.ui.onmessage = (numbers) => __awaiter(this, void 0, void 0, function* () {
    yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    //////////////////////////////////////////////////////////////////
    //PIE CHART
    //////////////////////////////////////////////////////////////////
    if (numbers.type === 'pie') {
        const width = 150;
        const height = 150;
        const widthPlus = 100;
        const frame = figma.createFrame();
        figma.currentPage.appendChild(frame);
        frame.resizeWithoutConstraints(width + widthPlus, height);
        let numbers2 = (numbers.numbers).map(x => Math.max(0, x)); //redukuje liczby ujemne
        const total = numbers2.reduce((a, b) => a + b, 0); //sumuje elementy w tablicy
        let start = 0;
        numbers2.sort();
        numbers2.reverse();
        //tworzenie elementów grafu kołowego
        for (const num of numbers2) {
            const c = Math.sqrt(start / total);
            const ellipse = figma.createEllipse();
            frame.appendChild(ellipse);
            ellipse.resizeWithoutConstraints(width, height);
            ellipse.fills = [{ type: 'SOLID', color: { r: c, g: c, b: c } }];
            ellipse.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
            ellipse.x = widthPlus;
            ellipse.arcData = {
                startingAngle: (start / total - 0.25) * 2 * Math.PI,
                endingAngle: ((start + num) / total - 0.25) * 2 * Math.PI,
                innerRadius: 0,
            };
            start += num;
        }
        //kolorowanie wykresu
        const ellipse_ColorBurn = figma.createEllipse();
        frame.appendChild(ellipse_ColorBurn);
        ellipse_ColorBurn.resizeWithoutConstraints(width, height);
        ellipse_ColorBurn.fills = [{ type: 'SOLID', color: { r: 0.28, g: 0.30, b: 0.82 } }];
        ellipse_ColorBurn.x = widthPlus;
        ellipse_ColorBurn.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
        ellipse_ColorBurn.blendMode = "OVERLAY";
        let start2 = 0;
        let heightVal = height;
        //legenda
        for (var i = 0; i < numbers2.length; i++) {
            const c = Math.sqrt(start2 / total);
            const posY = heightVal - 20 * i;
            const ellipseLabel = figma.createEllipse();
            frame.appendChild(ellipseLabel);
            ellipseLabel.resizeWithoutConstraints(15, 15);
            ellipseLabel.fills = [{ type: 'SOLID', color: { r: c, g: c, b: c } }];
            ellipseLabel.constraints = { horizontal: 'MIN', vertical: 'MAX' };
            ellipseLabel.x = widthPlus / 2;
            ellipseLabel.y = posY - 15;
            const ellipse_ColorBurn2 = figma.createEllipse();
            frame.appendChild(ellipse_ColorBurn2);
            ellipse_ColorBurn2.resizeWithoutConstraints(15, 15);
            ellipse_ColorBurn2.fills = [{ type: 'SOLID', color: { r: 0.28, g: 0.30, b: 0.82 } }];
            ellipse_ColorBurn2.x = widthPlus / 2;
            ellipse_ColorBurn2.y = posY - 15;
            ellipse_ColorBurn2.constraints = { horizontal: 'MIN', vertical: 'MAX' };
            ellipse_ColorBurn2.blendMode = "OVERLAY";
            const label = figma.createText();
            frame.appendChild(label);
            label.x = 5;
            label.y = posY - 5 - 15;
            label.resizeWithoutConstraints(40, 20);
            label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            label.characters = (numbers2[i] / total * 100).toFixed(1) + "%";
            label.fontSize = 12;
            label.textAlignHorizontal = 'CENTER';
            label.textAlignVertical = 'BOTTOM';
            label.constraints = { horizontal: 'MIN', vertical: 'MAX' };
            start2 += numbers2[i];
        }
        figma.closePlugin();
    }
    //////////////////////////////////////////////////////////////////
    //BAR CHART
    //////////////////////////////////////////////////////////////////
    if (numbers.type === 'bar') {
        const width = 310;
        const height = 200;
        const chartX = 100;
        const chartY = 55;
        const chartWidth = 210;
        const chartHeight = 120;
        const frame = figma.createFrame();
        figma.currentPage.appendChild(frame);
        frame.resizeWithoutConstraints(width, height);
        let numbers2 = (numbers.numbers).map(x => Math.max(0, x)); //redukuje liczby ujemne
        const min = numbers2.reduce((a, b) => Math.min(a, b), 0);
        const max = numbers2.reduce((a, b) => Math.max(a, b), 0);
        for (let i = 0; i < numbers2.length; i++) {
            const num = numbers2[i];
            const widthColumn = 25 * (7 / numbers2.length);
            const left = chartX + chartWidth * (i + 0.25) / numbers2.length;
            const right = chartX + chartWidth * (i + 0.75) / numbers2.length;
            const top = chartY + chartHeight - chartHeight * (Math.max(0, num) - min) / (max - min);
            const bottom = chartY + chartHeight - chartHeight * (Math.min(0, num) - min) / (max - min);
            // The column
            const column = figma.createRectangle();
            frame.appendChild(column);
            column.x = left;
            column.y = top;
            column.resizeWithoutConstraints(widthColumn, bottom - top);
            column.fills = [{ type: 'SOLID', color: { r: 0.28, g: 0.3, b: 0.83 } }];
            column.opacity = 0.4;
            column.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
            //dni tygodnia
            var weekDay = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];
            const label = figma.createText();
            frame.appendChild(label);
            label.x = left;
            label.y = height - 15;
            label.resizeWithoutConstraints(widthColumn, 15);
            label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            label.characters = weekDay[i % 7];
            label.fontSize = 12;
            label.textAlignHorizontal = 'CENTER';
            label.textAlignVertical = 'BOTTOM';
            label.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
            //podpis wartości
            const labelUp = figma.createText();
            frame.appendChild(labelUp);
            labelUp.x = left;
            labelUp.y = top - 15;
            labelUp.resizeWithoutConstraints(widthColumn, 15);
            labelUp.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
            labelUp.characters = num.toString();
            labelUp.fontSize = 12;
            labelUp.textAlignHorizontal = 'CENTER';
            labelUp.textAlignVertical = 'BOTTOM';
            labelUp.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
        }
        const caption = figma.createText();
        frame.appendChild(caption);
        caption.y = 155;
        caption.resizeWithoutConstraints(80, 20);
        caption.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        caption.characters = "Caption";
        caption.fontSize = 12;
        caption.textAlignHorizontal = 'LEFT';
        caption.textAlignVertical = 'BOTTOM';
        caption.constraints = { horizontal: "MIN", vertical: 'MAX' };
        const legend = figma.createEllipse();
        frame.appendChild(legend);
        var legendHeight = 12;
        legend.resizeWithoutConstraints(legendHeight, legendHeight);
        legend.fills = [{ type: 'SOLID', color: { r: 0.28, g: 0.3, b: 0.83 } }];
        legend.opacity = 0.4;
        legend.y = 155 - legendHeight;
        legend.arcData = { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 0 };
        legend.constraints = { horizontal: 'MIN', vertical: 'MAX' };
        figma.closePlugin();
    }
    //////////////////////////////////////////////////////////////////
    //CIRCLE PERCENT CHART
    //////////////////////////////////////////////////////////////////
    if (numbers.type === 'circle') {
        const width = 95;
        const height = 95;
        const frame = figma.createFrame();
        figma.currentPage.appendChild(frame);
        frame.resizeWithoutConstraints(width, height);
        let numbers3 = (numbers.numbers).map(x => Math.max(0, x)); //redukuje liczby ujemne, przerabia na procenty
        let numbers2 = numbers3.map(x => +x / 100);
        numbers2.sort();
        numbers2.reverse();
        const total = numbers2.reduce((a, b) => a + b, 0); //sumuje elementy w tablicy
        const supp = 1 - total;
        let start = 0;
        let itt = 0;
        let colorList = [0.93, 0.27, 0.31, /**/ 0.96, 0.64, 0.65, /**/ 0.36, 0.04, 0.05, /**/ 0.73, 0.06, 0.11, /**/ 0.96, 0.64, 0.65]; //R,G,B, R,G,B...
        const arc = figma.createEllipse();
        frame.appendChild(arc);
        arc.resizeWithoutConstraints(width, height);
        arc.arcData = { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 0.81 };
        //tworzenie elementów grafu kołowego
        for (const num of numbers2) { //0.2, 0.4...
            const c = Math.sqrt(start / total);
            const ellipse = figma.createEllipse();
            frame.appendChild(ellipse);
            ellipse.resizeWithoutConstraints(width, height);
            ellipse.fills = [{ type: 'SOLID', color: { r: colorList[3 * itt], g: colorList[3 * itt + 1], b: colorList[3 * itt + 2] } }];
            ellipse.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
            ellipse.arcData = {
                startingAngle: (start / 1 - 0.25) * 2 * Math.PI,
                endingAngle: ((start + num) / 1 - 0.25) * 2 * Math.PI,
                innerRadius: 0.81,
            };
            start += num;
            itt += 1;
        }
        let numbers4 = (numbers2).toString();
        numbers4 = numbers4.replace(/,/gi, "%\n");
        numbers4 = numbers4.replace(/0.0|0./gi, "");
        numbers4 = numbers4 + "%";
        const label = figma.createText();
        frame.appendChild(label);
        label.resizeWithoutConstraints(95, 95);
        label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        label.characters = numbers4;
        if (numbers2.length == 4) {
            label.fontSize = 12;
        }
        if (numbers2.length == 3) {
            label.fontSize = 15;
        }
        if (numbers2.length <= 2) {
            label.fontSize = 20;
        }
        label.textAlignHorizontal = 'CENTER';
        label.textAlignVertical = 'CENTER';
        label.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
        figma.closePlugin();
    }
    //////////////////////////////////////////////////////////////////
    //TIME GRAPH
    //////////////////////////////////////////////////////////////////
    if (numbers.type === 'time') {
        let numbers2 = (numbers.numbers).map(x => Math.max(0, x)); //redukuje liczby ujemne
        let colorList = [0.86, 0.86, 0.87, /**/ 0.86, 0.86, 0.87, /**/ 0.86, 0.86, 0.87, /**/ 0.65, 0.66, 0.92, /**/ 0.28, 0.30, 0.83, /**/ 0.11, 0.13, 0.22]; //R,G,B, R,G,B...
        const width = 240 + (numbers2[0] - 1) * 2;
        const height = 110 + (numbers2[1] - 1) * 2;
        const plusWidth = 50;
        const plusHeight = 25;
        const frame = figma.createFrame();
        figma.currentPage.appendChild(frame);
        frame.resizeWithoutConstraints(width + plusWidth, height + plusHeight);
        const columnWidth = 240 / numbers2[0];
        const columnHeight = 110 / numbers2[1];
        for (var i = 0; i < numbers2[0]; i++) { //0, 1, 2, ... , x
            for (var j = 0; j < numbers2[1]; j++) { //0, 1, ... , y
                const column = figma.createRectangle();
                frame.appendChild(column);
                column.x = plusWidth + i * columnWidth + 2 * i;
                column.y = j * columnHeight + 2 * j;
                column.resizeWithoutConstraints(columnWidth, columnHeight);
                var x = Math.floor(Math.random() * 6);
                column.fills = [{ type: 'SOLID', color: { r: colorList[3 * x], g: colorList[3 * x + 1], b: colorList[3 * x + 2] } }];
                column.cornerRadius = 2;
                column.constraints = { horizontal: 'SCALE', vertical: "SCALE" };
            }
        }
        for (var j = 0; j < numbers2[1]; j++) { //0, 1, ... , y
            const label = figma.createRectangle();
            frame.appendChild(label);
            label.resizeWithoutConstraints(columnHeight * 0.8, columnHeight * 0.8);
            label.x = 0;
            label.y = j * columnHeight + 2 * j + (columnHeight - columnHeight * 0.8) / 2;
            label.fills = [{ type: 'SOLID', color: { r: colorList[3], g: colorList[4], b: colorList[5] } }];
            label.cornerRadius = 0.3 * columnHeight;
            label.constraints = { horizontal: 'SCALE', vertical: "SCALE" };
        }
        for (var j = 0; j < numbers2[0]; j++) { //0, 1, ... , y
            const label = figma.createText();
            frame.appendChild(label);
            label.resizeWithoutConstraints(18, 15);
            label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            label.characters = (j * 2).toString();
            label.textAlignHorizontal = 'CENTER';
            label.fontSize = 13;
            label.x = plusWidth - 9 + j * columnWidth + 2 * j;
            label.y = height + 7;
        }
        figma.closePlugin();
    }
});
