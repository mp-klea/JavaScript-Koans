function isCellAliveInNextGeneration(isCellAlive, numberOfLiveNeighbours) {

	return isCellAlive ? (numberOfLiveNeighbours >= 2 && numberOfLiveNeighbours <= 3) : numberOfLiveNeighbours === 3;

}
