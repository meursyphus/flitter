import Assets from './assets';
import Image from './Image';

function Note() {
	return Image({ width: 12, height: 12, src: Assets.note });
}

export default Note;
