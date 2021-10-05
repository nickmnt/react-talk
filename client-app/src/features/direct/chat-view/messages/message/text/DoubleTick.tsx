import Tick from "./Tick";

export default function DoubleTick() {
    return (
        <div className="doubleTick">
            <div className="doubleTick__firstTick">
                <Tick />
            </div>
            <div className="doubleTick__secondTick">
                <Tick />
            </div>
        </div>
    )
}