import React, { useEffect, useState } from 'react';

function SingleSet(props) {
    const setInitialValue = {
        id: props.id,
        weight: props.weight,
        sets: props.sets,
        reps: props.reps,
    }

    const [currentSetValue, updateSetValue] =
    useState(setInitialValue);

    function handleWeightChange(e) {
        // update weight
        const setWithUpdatedWeight = currentSetValue;
        // const setWithUpdatedWeight =
        // {...currentSetValue, weight: e.target.value};
        setWithUpdatedWeight.weight = e.target.value;
        updateSetValue(setWithUpdatedWeight);
        // send to fater
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps);
    }

    function handleSetsChange(e) {
        // update sets
        const setWithUpdatedSets = currentSetValue;
        // const setWithUpdatedSets =
        // {...currentSetValue, sets: e.target.value};
        setWithUpdatedSets.sets = e.target.value;
        updateSetValue(setWithUpdatedSets);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps);
    }

    function handleRepsChange(e) {
        // update reps
        const setWithUpdatedReps = currentSetValue;
        // const setWithUpdatedReps =
        // {...currentSetValue, reps: e.target.value};
        setWithUpdatedReps.reps = e.target.value;
        updateSetValue(setWithUpdatedReps);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps);
    }

    function handleSetDeletion(e) {
        e.preventDefault();
        props.handleSetDeletion(props.id);
    }

    const editingTemplate = (
        <div className="single-set-form">
            <input
            className="input-number"
            type="number"
            step='any'
            placeholder='weight'
            defaultValue={props.weight}
            onChange={handleWeightChange}>
            </input>
            <label htmlFor="weight-unit">
                kg
            </label>
            <input
            className="input-number"
            type="number"
            step='any'
            placeholder="sets"
            defaultValue={props.sets}
            onChange={handleSetsChange}>
            </input>
            <label htmlFor="x">
                x
            </label>
            <input
            className="input-number"
            type="number"
            step='any'
            placeholder="reps"
            defaultValue={props.reps}
            onChange={handleRepsChange}>
            </input>
            <button
            className="btn delete-set-btn"
            onClick={handleSetDeletion}
            >
                X
            </button>
        </div>
    )

    const viewTemplate = (
        <div>
            {props.weight} kg {props.sets} sets x {props.reps} reps
        </div>
    )
    return (
        props.isEditing? editingTemplate : viewTemplate
    )
}

export default SingleSet;