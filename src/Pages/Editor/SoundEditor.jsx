import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SoundAccordion from './SoundAccordion.jsx';
import './SoundEditor.css';

const SoundEditor = ({sounds}) =>{

    // Function to save sounds to the selectedSounds object:
    const setSounds = () => {

    }

    const dispatch = useDispatch();
    const modal = useSelector(state => state.editorOne.modal);

    //setActive Index is what sound we're editing
    const [activeIndex, setActiveIndex] = useState(null);
    const [selectedSounds, setSelectedSounds] = useState({sound1: null, sound2: null, sound3: null, sound4: null});


    return (
        <section id="editor">
        <div className = "sound-btns">
            {selectedSounds.sound1 ?
            <button onClick = {()=>setActiveIndex(1)}>{selectedSounds.sound1.name}</button>
            :
            <button onClick = {()=>setActiveIndex(1)}>Sound1</button>
            }
            {selectedSounds.sound2 ?
            <button onClick = {()=>setActiveIndex(2)}>{selectedSounds.sound2.name}</button>
            :
            <button onClick = {()=>setActiveIndex(2)}>Sound2</button>
            }
            {selectedSounds.sound3 ?
            <button onClick = {()=>setActiveIndex(3)}>{selectedSounds.sound3.name}</button>
            :
            <button onClick = {()=>setActiveIndex(3)}>Sound3</button>
            }
            {selectedSounds.sound4 ?
            <button onClick = {()=>setActiveIndex(4)}>{selectedSounds.sound4.name}</button>
            :
            <button onClick = {()=>setActiveIndex(4)}>Sound4</button>
            }
        </div>
        
                <SoundAccordion 
                    hidden={activeIndex === null} 
                    sounds={sounds} 
                    activeIndex={activeIndex} 
                    selectedSounds={selectedSounds} 
                    setSelectedSounds={setSelectedSounds}
                />
            
        </section>
    )
}

export default SoundEditor  