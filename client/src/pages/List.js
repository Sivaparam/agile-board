import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { BOARD_DETAILS } from "../utils/queries";
import { ADD_CARD, ADD_LIST} from "../utils/mutations";
import CardBlock from '../components/CardBlock';
import ListPage from '../components/ListPage';

function List() {

    const { boardParam } = useParams();
    const [Title, setTitle] = useState('');
    const [listTitle, setListTitle] = useState('');
    const [parentId, setParentId] = useState('');
    const [parentListId, setParentListId] = useState('');
    const [showFrom, setShowForm ] = useState(false);
    const [showListFrom, setShowListForm ] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Name is required');
    const { loading, data } = useQuery(BOARD_DETAILS, {
        variables: { boardId: boardParam },
    });
    console.log(data);
    const boards = data?.boards || [];

    const openForm =  async (e) => {
        e.stopPropagation();
     setShowForm(!showFrom);
    }

    const openListForm =  () => {
        setShowListForm(!showListFrom);
    }


    const [addCard, { error, data1 }] = useMutation(ADD_CARD);
    const [addList, { error2, data2 }] = useMutation(ADD_LIST);


    const handleAddCard = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        console.log(Title);
        console.log(parentId);

        if (!Title) {
            e.preventDefault();
            setErrorMessage('Title required/Press Cancel');
            return;
        }
        try {
            const { data } = await addCard({
                variables: { cTitle: Title, listId: parentId },
            });

        } catch (error) {
            console.log(e);
        }
        window.location.reload();
        console.log(`Card ${Title} created`);
        setTitle('');

    };

    const handleAddList = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        console.log(listTitle);
        console.log(parentListId);

        if (!listTitle) {
            e.preventDefault();
            setErrorMessage('Title required/Press Cancel');
            return;
        }
        try {
            const { data } = await addList({
                variables: { lTitle: listTitle, boardId: parentListId },
            });

        } catch (error) {
            console.log(e);
        }
        window.location.reload();
        console.log(`List ${listTitle} created`);
        setListTitle('');

    };


    const handleInput = (e) => {
        // Getting the value and name of the input which triggered the change
        const { value, id } = e.target;
        setTitle(value);
        setParentId(id);
    };

    const handleListInput = (e) => {
        // Getting the value and name of the input which triggered the change
        const { value, id } = e.target;
        setListTitle(value);
        setParentListId(id);
    };

    return (

        <div className="my-2">
            <h3>{boards.bTitle}</h3>
            {showListFrom ? (
             <form className="form">
              <input className="form-input" id={boards._id} type='text' name="listTitle" onChange={handleListInput} value={listTitle} placeholder="List Title"></input>

              <button className="btn btn-light m-1" onClick={openForm}>Cancel</button>
              <button className="btn btn-light m-1" onClick={handleAddList}>Add List</button>
            </form >
             ) : (
             <button type="button" id={boards._id} className="btn btn-lg btn-light m-2" onClick={openListForm}>Add List</button>
            ) }
           
            <div>
                {loading ? (
                    <div> Loading...</div>
                ) : (
                    <div className="flex-row" >
                        {boards.lists.map((listDetail, index) => (
                            <ListPage key={index} id={listDetail._id} className='p-3 bg-link m-1'>
                                <h4>{listDetail.lTitle}</h4>
                                {listDetail.cards.map((cardDetail, index) => (
                                    <CardBlock key={index} id={cardDetail._id} className='p-1 m-1 bg-light' draggable='true'>
                                        <h5>{cardDetail.cTitle}</h5>
                                    </CardBlock>
                                ))}
                                {showFrom ? (
                                    <form className="form">
                                            <input className="form-input" id={listDetail._id} type='text' name="Title" onChange={handleInput} value={Title} placeholder="Card Title"></input>

                                            <button className="btn btn-light m-1" onClick={openForm}>Cancel</button>
                                            <button className="btn btn-light m-1" onClick={handleAddCard}>Submit</button>
                                        </form >
                                ) : (
                                <button type="button" id={listDetail._id} className="btn btn-lg btn-light m-2" onClick={openForm}>Add Card</button>
                                ) }
                            </ListPage>
                        ))}
                        
                    </div>
                )}


            </div>

        </div>



    )
};
export default List;