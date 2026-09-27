using UnityEngine;

public class BackgroundLoop : MonoBehaviour {
    private float width; // 배경의 가로 길이

    private void Awake() {
        // 가로 길이를 측정하는 처리
        BoxCollider2D bgCollider = GetComponent<BoxCollider2D>();
        width = bgCollider.size.x;
    }

    private void Update() {
        // 현재 위치가 원점에서 왼쪽으로 width 이상 이동했을때 위치를 리셋
        if (transform.position.x <= -width) { //-width는 -100과 같음 && -로 갔기 때문에 repositioning해야함
            Reposition();
        }
    }

    private void Reposition() {
        Vector2 offset = new Vector2(width * 3f, 0);
        transform.position = (Vector2) transform.position + offset;

    }
}
