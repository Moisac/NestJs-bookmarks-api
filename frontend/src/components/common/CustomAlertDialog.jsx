import { useRef } from 'react'
import { AlertDialog, Button, Text, Link } from "native-base";
import { formatDate } from '../../util/DateUtils'

const CustomAlertDialog = ({ 
  deleteBookmark, 
  setDeleteBookmark, 
  infoBookmark, 
  setInfoBookmark,
  handleDeleteBookmark 
}) => {

    const cancelRef = useRef(null);

    const handleClose = () => {
      setDeleteBookmark(null)
      setInfoBookmark({})
    }

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={!!deleteBookmark || !!infoBookmark?.title} onClose={handleClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            { !!deleteBookmark ? `Delete Bookmark with id ${deleteBookmark}` : `Info about bookmark with id ${infoBookmark.id}`}
          </AlertDialog.Header>
          <AlertDialog.Body>
            {  !!deleteBookmark ? `Are you sure you want to delete this bookmark?` : (
              <>
                <Text>Title: { infoBookmark?.title }</Text>
                <Text>Description: { infoBookmark?.description }</Text>
                <Text>URL: 
                  <Link 
                  href={infoBookmark?.link} 
                  isExternal 
                  _text={{
                    _light: {
                      color: "darkBlue.600"
                    },
                    color: "darkBlue.600"
                  }}
                >
                    Click here
                  </Link>
                </Text>
                <Text>Created at: { formatDate(new Date(infoBookmark?.createdAt)) }</Text>
                <Text>Updated at: { formatDate(new Date(infoBookmark?.createdAt)) }</Text>
              </>
            )} 
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={handleClose} ref={cancelRef}>
                Cancel
              </Button>
              { !!deleteBookmark ? 
                <Button colorScheme="danger" onPress={handleDeleteBookmark}>
                  Delete
                </Button> 
                : 
                <></>
              }
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
  )
}

export default CustomAlertDialog