export function line(ctx:CanvasRenderingContext2D, x1:number, y1:number, x2:number, y2:number) {
	ctx.beginPath();	
	ctx.moveTo(x1, y1);
	
	ctx.lineTo(x2,y2);    
    ctx.closePath();		
	ctx.stroke();   
}

export function circle(ctx:CanvasRenderingContext2D, x:number, y:number, r:number) {
	ctx.beginPath();    
	ctx.arc(x + r,y + r, r, 0, 2 * Math.PI, true);	
	ctx.closePath();    
	ctx.fill();		
}

