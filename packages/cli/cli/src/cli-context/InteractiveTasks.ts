import ansiEscapes from "ansi-escapes";
import ora, { Ora } from "ora";
import { InteractiveTaskContextImpl } from "./InteractiveTaskContextImpl";

export class InteractiveTasks {
    private tasks: InteractiveTaskContextImpl[] = [];
    private lastPaint = "";
    private spinner = ora({ spinner: "dots11" });
    private interval: NodeJS.Timeout;

    constructor(private readonly stream: NodeJS.WriteStream) {
        this.paint();
        this.interval = setInterval(() => {
            this.repaint();
        }, getSpinnerInterval(this.spinner));
    }

    public finish(): void {
        clearInterval(this.interval);
        this.repaint();
    }

    public addTask(context: InteractiveTaskContextImpl): void {
        this.tasks.push(context);
    }

    public repaint({ contentAbove = "" }: { contentAbove?: string } = {}): void {
        this.stream.write(this.clear() + contentAbove + this.paint());
    }

    private clear(): string {
        return ansiEscapes.eraseLines(this.lastPaint.length > 0 ? countLines(this.lastPaint) : 0);
    }

    private paint(): string {
        const spinnerFrame = this.spinner.frame();
        let paint = "";
        for (const task of this.tasks) {
            paint += task.print({ spinner: spinnerFrame }) + "\n";
        }
        this.lastPaint = paint;
        return paint;
    }
}

function getSpinnerInterval(spinner: Ora) {
    if (typeof spinner.spinner !== "string" && spinner.spinner.interval != null) {
        return spinner.spinner.interval;
    } else {
        return 100;
    }
}

function countLines(str: string): number {
    return [...str].filter((char) => char === "\n").length + 1;
}