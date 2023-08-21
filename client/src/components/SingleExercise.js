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
        id: null,
        weight: null,
        sets: null,
        reps: null,
    }

    const [currentSetList, setSetList] =
    useState(initialListOfSets);

    useEffect(() => {
        if (props.isPrefilled) {
            setSetList(props.setLog);
        }
    });
    // }, []);

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
        // create new empty set with unique id
        const newId = uuidv4();
        const newSet = emptySet;
        // assign new id
        newSet.id = newId;
        const newList = currentSetList.concat(newSet);
        setSetList(newList);
    }

    const editingTemplate = (
        <div>
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
                        />
                    </li>
                ))}
                <li>
                    <button
                    className="btn btn-add-set"
                    onClick={handleAddingSet}>
                        Add Another Set
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