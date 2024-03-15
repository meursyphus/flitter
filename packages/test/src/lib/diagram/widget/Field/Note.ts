import Assets from './assets';
import Image from './Image';

function Note() {
	return Image({ width: 16, height: 16, src: Assets.note });
}

export default Note;
