import React, { useState, useEffect} from 'react';
import SingleSet from './SingleSet';
import { v4 as uuidv4 } from 'uuid';

function SingleExercise(props) {
    // exerciseName is passed: it's prefilled or null,
    // either way it's well defined.
    const initialExerciseName = props.exerciseName;

    const [currentExerciseName, setExerciseName] =
    useState(initialExerciseName);

    // same for set log.
    const initialListOfSets = props.setLog;

    const emptySet = {
        isNew: true,
        id: null,
        weight: null,
        sets: null,
        reps: null,
    }

    const [currentSetList, setSetList] =
    useState(initialListOfSets);

    // initialize setList with the props
    useEffect(() => {
        if (props.isPrefilled) {
            setSetList(props.setLog);
        }
    }, [currentSetList]);
    // }, []);

    // handle deletion of set with id
    function handleSetDeletion(idToDelete) {
        const changedSetList =
        currentSetList.filter((set) => set.id !== idToDelete);
        setSetList(changedSetList);
        props.handleExerciseChange(props.id, currentExerciseName,
            changedSetList);
    }

    // handle specific set change
    function handleSetChange(id, changedWeight, changedSets,
        changedReps) {
        const changedSetList = currentSetList.map((set) =>
        {
            if (id === set.id) {
                return {...set, weight: changedWeight,
                sets: changedSets, reps: changedReps}
            }
            return set;
        });
        setSetList(changedSetList);
        props.handleExerciseChange(props.id, currentExerciseName,
            changedSetList);
        // here I pass changedSetList instead of currentSetList
        // because parent component was not updating properly
        // (was always one change behind), and now somehow
        // it does work. how? idk man.
    }

    function handleNameChange(e) {
        e.preventDefault();
        // update new name and send to fater
        const changedExerciseName = e.target.value;
        setExerciseName(e.target.value);
        props.handleExerciseChange(props.id, changedExerciseName,
            currentSetList);
        // passing changedExerciseName instead of state name,
        // hope it fixes parent updating problem.
    }

    // assign id to new set
    function handleAddingSet(e) {
        e.preventDefault();
        // alert("adding a new set!");
        // create new empty set with unique id
        const newId = uuidv4();
        const newSet = emptySet;
        // assign new id
        newSet.id = newId;
        const newList = currentSetList.concat(newSet);
        // alert("new list with new set is" + JSON.stringify(newList));
        setSetList(newList);
        // adding a new set is also an exercise change
        props.handleExerciseChange(props.id, currentExerciseName,
            newList);
    }

    function handleExerciseDeletion(e) {
        e.preventDefault();
        props.handleExerciseDeletion(props.id);
    }

    const editingTemplate = (
        <div className="container">
            <select
            className="dropdown-menu"
            defaultValue={initialExerciseName}
            onChange={handleNameChange}
            >
            <option value="Squat"> Squat </option>
            <option value="Bench Press"> Bench Press </option>
            <option value="Overhead Press"> Overhead Press </option>
            <option value="Deadlift"> Deadlift </option>
            <option value="Power Clean"> Power Clean </option>
            <option value="Add Your Own"> Add Your Own </option>
            </select>
            <button
            className="btn delete-exercise-btn"
            onClick={handleExerciseDeletion}>
                &#x2715;
            </button>
            <ul className="list-of-sets">
                {currentSetList?.map((set) => (
                    <li key={set.id}>
                        <SingleSet
                        isEditing={true}
                        id={set.id}
                        weight={set.weight}
                        sets={set.sets}
                        reps={set.reps}
                        handleSetChange={handleSetChange}
                        handleSetDeletion={handleSetDeletion}
                        />
                    </li>
                ))}
                <li>
                    <button
                    className="btn btn-add-set"
                    onClick={handleAddingSet}>
                        + Add Set
                    </button>
                </li>
            </ul>
        </div>
    )

    const viewTemplate = (
        <div>
            <b>
                {initialExerciseName}
            </b>
            <ul className="list-of-sets">
                {currentSetList?.map((set) => (
                    <li key={set.id}>
                        <SingleSet
                        isEditing={false}
                        weight={set.weight}
                        sets={set.sets}
                        reps={set.reps}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        props.isEditing? editingTemplate : viewTemplate
    )
}

export default SingleExercise;