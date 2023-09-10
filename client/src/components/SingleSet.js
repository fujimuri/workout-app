import React, { useState } from 'react';

function SingleSet(props) {
    const setInitialValue = {
        id: props.id,
        weight: props.weight,
        sets: props.sets,
        reps: props.reps,
        inputErrors: props.inputErrors,
    }

    const [currentSetValue, updateSetValue] =
    useState(setInitialValue);

    const [currentErrorMessage, setCurrentErrorMessage] = useState('');

    const [weightError, setWeightError] = useState(false);
    const [setsError, setSetsError] = useState(false);
    const [repsError, setRepsError] = useState(false)

    function handleWeightChange(e) {
        const newWeight = e.target.value;
        const setWithUpdatedWeight = currentSetValue;
        if (newWeight !== "" && !/^-?[0-9]*(\.[0-9]+)?$/.test(newWeight)) {
            setCurrentErrorMessage('Weight must be a number');
            setWeightError(true);
            setWithUpdatedWeight.inputErrors = true;
        } else {
            // weight input is ok :)
            setCurrentErrorMessage('');
            setWeightError(false);
            setWithUpdatedWeight.inputErrors = false;
        }
        setWithUpdatedWeight.weight = newWeight;
        updateSetValue(setWithUpdatedWeight);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps, currentSetValue.inputErrors);
    }

    function handleSetsChange(e)
    {
        const newSets = e.target.value;
        const setWithUpdatedSets = currentSetValue;
        if (newSets !== "" && (!/^[1-9]\d*$/.test(newSets)
        || parseFloat(newSets) <= 0)) {
            setCurrentErrorMessage('Sets must be a whole positive number');
            setSetsError(true);
            setWithUpdatedSets.inputErrors = true;
        } else {
            setCurrentErrorMessage('');
            setSetsError(false);
            setWithUpdatedSets.inputErrors = false;
        }
        setWithUpdatedSets.sets = newSets;
        updateSetValue(setWithUpdatedSets);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps, currentSetValue.inputErrors);
    }

    function handleRepsChange(e) {
        const newReps = e.target.value;
        const setWithUpdatedReps = currentSetValue;
        if (newReps !== "" && (!/^[1-9]\d*$/.test(newReps)
        || parseFloat(newReps) <= 0)) {
            setCurrentErrorMessage('Reps must be a whole positive number');
            setRepsError(true);
            setWithUpdatedReps.inputErrors = true;
        } else {
            setCurrentErrorMessage('');
            setRepsError(false);
            setWithUpdatedReps.inputErrors = false;
        }
        setWithUpdatedReps.reps = newReps;
        updateSetValue(setWithUpdatedReps);
        props.handleSetChange(currentSetValue.id, currentSetValue.weight,
        currentSetValue.sets, currentSetValue.reps, currentSetValue.inputErrors);
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