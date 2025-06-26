
export function InputSelection() {
    const scrollDiv = document.querySelector(".scrollable") as HTMLElement;
    const inputDiv = document.querySelector(".input-selection") as HTMLInputElement;
    let prevTop: number = 0;
    let prevLeft: number = 0;


    scrollDiv.addEventListener("click", (e) => {
        let left = Math.floor((e.clientX + scrollDiv.scrollLeft - 50) / 100) * 100 + 50;
        let top = Math.floor((e.clientY + scrollDiv.scrollTop - 25) / 24) * 24 + 25;
        
        if(prevTop !== top || prevLeft !== left){
            inputDiv.value = "";
            prevTop = top;
            prevLeft = left;
        }

        inputDiv.style.top = `${top}px`;
        inputDiv.style.left = `${left}px`;
        // console.log("row", Math.ceil((e.clientY + scrollDiv.scrollTop - 25) / 24), "col", Math.ceil((e.clientX + scrollDiv.scrollLeft - 50) / 100));
        inputDiv.focus();
    })
}