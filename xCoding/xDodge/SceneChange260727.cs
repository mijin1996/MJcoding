using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.EventSystems; //인터페이스를 위해
using System.Collections; //코루틴을 위해

public class SceneChange : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler, IPointerClickHandler {
    public int sceneNumber;
    public AudioClip clickSfx;
    public float buttonScale = 1.1f;
    private Vector3 originalSize;

    void Start() {
        originalSize = transform.localScale;
    }

    public void OnPointerEnter(PointerEventData eventData) {
        transform.localScale = originalSize * buttonScale;
    }

    public void OnPointerExit(PointerEventData eventData) {
        transform.localScale = originalSize;
    }


    public void OnPointerClick(PointerEventData eventData) {
        Click();
    }
    public void Click() {
        StartCoroutine(ClickAndLoad());
    }
    IEnumerator ClickAndLoad() {
        transform.localScale = originalSize * buttonScale;

        if (clickSfx != null && Camera.main != null) {
            AudioSource.PlayClipAtPoint(clickSfx, Camera.main.transform.position);
        }

        yield return new WaitForSecondsRealtime(0.3f);

        SceneManager.LoadScene(sceneNumber);
    }
}
