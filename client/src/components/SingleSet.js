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

    const [currentErrorMessage, setCurrentErrorMessage] = useState('');

    const [weightError, setWeightError] = useState(false);
    const [setsError, setSetsError] = useState(false);
    const [repsError, setRepsError] = useState(false)

    function handleWeightChange(e) {
        // update weight
        const setWithUpdatedWeight = currentSetValue;
        // const setWithUpdatedWeight =
        // {...currentSetValue, weight: e.target.value};
        const newWeight = e.target.value;
        setWithUpdatedWeight.weight = newWeight;
        updateSetValue(setWithUpdatedWeight);
        // send to fater
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps);
        // validate input and show error message if needed
        // TODO update errors variable
        if (!/^[0-9]*(\.[0-9]+)?$/.test(newWeight)
        || parseFloat(newWeight) <= 0) {
            setCurrentErrorMessage('Weight must be a positive number');
            setWeightError(true);
        } else {
            // weight input is ok :)
            setCurrentErrorMessage('');
            setWeightError(false);
        }
    }

    function handleSetsChange(e) {
        // update sets
        const setWithUpdatedSets = currentSetValue;
        // const setWithUpdatedSets =
        // {...currentSetValue, sets: e.target.value};
        const newSets = e.target.value;
        setWithUpdatedSets.sets = newSets;
        updateSetValue(setWithUpdatedSets);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps);
        // validate input and show error message if needed
        // TODO update errors variable
        if (!/^[1-9]\d*$/.test(newSets)
        || parseFloat(newSets) <= 0) {
            setCurrentErrorMessage('Sets must be a whole positive number');
            setSetsError(true);
        } else {
            setCurrentErrorMessage('');
            setSetsError(false);
        }
    }

    function handleRepsChange(e) {
        // update reps
        const setWithUpdatedReps = currentSetValue;
        // const setWithUpdatedReps =
        // {...currentSetValue, reps: e.target.value};
        const newReps = e.target.value;
        setWithUpdatedReps.reps = newReps;
        updateSetValue(setWithUpdatedReps);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps);
        if (!/^[1-9]\d*$/.test(newReps)
        || parseFloat(newReps) <= 0) {
            setCurrentErrorMessage('Reps must be a whole positive number');
            setRepsError(true);
        } else {
            setCurrentErrorMessage('');
            setRepsError(false);
        }
    }

    function handleSetDeletion(e) {
        e.preventDefault();
        props.handleSetDeletion(props.id);
    }

    const editingTemplate = (
        <div>
            <div className="single-set-form">
            <input
            className="input-number"
            type="number"
            step='any'
            placeholder='weight'
            defaultValue={props.weight}
            onChange={handleWeightChange}
            disabled={setsError || repsError }
            >
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
            onChange={handleSetsChange}
            disabled={weightError || repsError }
            >
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
            onChange={handleRepsChange}
            disabled={weightError || setsError }
            >
            </input>
            <button
            className="btn delete-set-btn"
            onClick={handleSetDeletion}
            >
                &#x2715;
            </button>
            </div>
            <div className="set-error-messages">
                {currentErrorMessage}
            </div>
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